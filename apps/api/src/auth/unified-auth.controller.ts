import { Controller, Post, Body, Res, BadRequestException } from "@nestjs/common";
import { Throttle, SkipThrottle } from "@nestjs/throttler";
import { Response } from "express";
import { UnifiedAuthService } from "./unified-auth.service";

const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

@SkipThrottle({ login: true, form: true })
@Controller("auth")
export class UnifiedAuthController {
  constructor(private readonly svc: UnifiedAuthService) {}

  @Post("login")
  @Throttle({ login: {} })
  async login(
    @Body() body: { email: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!body.email?.trim() || !body.password) {
      throw new BadRequestException("Email and password are required");
    }
    const result = await this.svc.login(body.email, body.password);

    if (result.role === "admin") {
      res.cookie("admin_jwt", result.token, { ...COOKIE_OPTS });
    } else {
      res.cookie("customer_jwt", result.token, { ...COOKIE_OPTS, maxAge: 7 * 24 * 60 * 60 * 1000 });
    }

    return { role: result.role, user: result.user };
  }

  @Post("logout")
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie("admin_jwt", { path: "/" });
    res.clearCookie("customer_jwt", { path: "/" });
    return { success: true };
  }

  @Post("forgot-password")
  @Throttle({ form: {} })
  async forgotPassword(@Body() body: { email: string }) {
    await this.svc.forgotPassword(body.email || "");
    return { success: true };
  }

  @Post("reset-password")
  async resetPassword(@Body() body: { token: string; newPassword: string }) {
    await this.svc.resetPassword(body.token, body.newPassword);
    return { success: true };
  }
}
