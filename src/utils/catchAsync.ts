import { NextResponse } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RequestHandler = (req: Request, context?: any) => Promise<NextResponse>;

const catchAsync = (fn: RequestHandler) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return async (req: Request, context?: any) => {
    try {
      return await fn(req, context);
    } catch (error: any) {
      console.error("Error:", error);
      
      return NextResponse.json(
        {
          success: false,
          message: error.message || "Something went wrong",
          errorMessages: error,
        },
        { status: error.statusCode || 500 }
      );
    }
  };
};

export default catchAsync;