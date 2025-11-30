import { NextResponse } from "next/server";

type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string;
  data: T;
};

const sendResponse = <T>(data: TResponse<T>) => {
  return NextResponse.json(
    {
      success: data.success,
      message: data.message,
      data: data.data,
    },
    { status: data.statusCode }
  );
};

export default sendResponse;