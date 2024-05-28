export type ActionResult =
  | {
      success: true
      message: string
    }
  | {
      success: false
      error: string
    }
