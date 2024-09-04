import { NextResponse } from "next/server";
import piston from "piston-client";

const client = piston({ server: "https://emkc.org" });
function compareOutputs(expected, actual) {
  // Extract the first number in both the expected and actual output
  const expectedNumber = expected.match(/\d+/)?.[0]; // Extract the number from the expected output
  const actualNumber = actual.match(/\d+/)?.[0]; // Extract the number from the actual output

  // If both numbers are found, compare them
  if (expectedNumber && actualNumber) {
    return expectedNumber === actualNumber;
  }

  // If no numbers are found, fall back to a strict comparison (in case of non-numeric outputs)
  return expected.trim().toLowerCase() === actual.trim().toLowerCase();
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runPistonWithRetry(language, code, stdin, retries = 3) {
  try {
    const result = await client.execute(language, code, { stdin });

    // Check if we hit the rate limit and retry if necessary
    if (
      result &&
      result.message &&
      result.message.includes("Requests limited to")
    ) {
      if (retries > 0) {
        console.log("Hit rate limit, retrying after delay...");
        await delay(500); // Wait for 500ms before retrying
        return runPistonWithRetry(language, code, stdin, retries - 1);
      } else {
        throw new Error("Rate limit exceeded, no retries left");
      }
    }

    return result; // Return the result if no rate limit issue
  } catch (error) {
    throw error; // Propagate the error for further handling
  }
}

export async function POST(req) {
  try {
    const { code, language, testCases } = await req.json();

    let allPassed = true;
    const results = [];

    for (const testCase of testCases) {
      // Execute code using Piston API with retries
      const result = await runPistonWithRetry(language, code, testCase.input);

      console.log("Piston API Response:", result);

      // Check if result.run exists before trying to access stdout or stderr
      if (!result.run) {
        throw new Error("No run data in Piston API response.");
      }

      // Safely check if stdout exists; fallback to stderr if stdout is empty
      const output = result.run.stdout ? result.run.stdout.trim() : null;
      const errorOutput = result.run.stderr ? result.run.stderr.trim() : null;

      // If both stdout and stderr are missing, handle it as an error
      if (!output && !errorOutput) {
        throw new Error("No output or error message from code execution.");
      }

      // Use the valid output (stdout or stderr) for comparison
      const finalOutput = output || errorOutput;
      const passed = compareOutputs(testCase.output, finalOutput);

      results.push({
        input: testCase.input,
        expectedOutput: testCase.output,
        actualOutput: finalOutput,
        passed,
      });

      if (!passed) allPassed = false;
    }

    return NextResponse.json({ allPassed, results });
  } catch (error) {
    console.error("Error running code:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
