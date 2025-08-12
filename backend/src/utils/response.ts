export class ResponseHandler {
  static sendSuccessResponse(res: any, data: any, message: string, metadata: any = {}) {
    return res.status(200).json({
      success: true,
      data,
      message,
      ...metadata,
    });
  }

  static sendErrorResponse(res: any, status: number, message: string) {
    return res.status(status).json({
      success: false,
      message,
    });
  }
}