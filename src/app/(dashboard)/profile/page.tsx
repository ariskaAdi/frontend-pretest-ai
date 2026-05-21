"use client";

import * as React from "react";
import { Mail, User, Shield, CheckCircle2, ArrowRight, LockKeyhole, Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Card } from "@/components/shared/Card";
import { Input } from "@/components/shared/Input";
import { Button } from "@/components/shared/Button";
import { useToast } from "@/components/shared/Toast";
import { useGetMeQuery } from "@/queries/useUserQuery";
import {
  useRequestEmailUpdateMutation,
  useVerifyEmailUpdateMutation,
  useRequestPasswordUpdateMutation,
  useVerifyPasswordUpdateMutation,
} from "@/queries/useUserQuery";
import { useAuthStore } from "@/stores/authStore";
import { cn } from "@/lib/utils";

type Step = "idle" | "otp";

export default function ProfilePage() {
  const t = useTranslations("ProfilePage");
  const router = useRouter();
  const { data: user } = useGetMeQuery();
  const { toast } = useToast();
  const clearAuth = useAuthStore((s) => s.clearAuth);

  // --- Email update state ---
  const [emailStep, setEmailStep] = React.useState<Step>("idle");
  const [newEmail, setNewEmail] = React.useState("");
  const [emailError, setEmailError] = React.useState("");
  const [emailDigits, setEmailDigits] = React.useState<string[]>(Array(6).fill(""));
  const emailInputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  const requestEmailMutation = useRequestEmailUpdateMutation();
  const verifyEmailMutation = useVerifyEmailUpdateMutation();

  // --- Password update state ---
  const [pwStep, setPwStep] = React.useState<Step>("idle");
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showCurrent, setShowCurrent] = React.useState(false);
  const [showNew, setShowNew] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [pwErrors, setPwErrors] = React.useState({ current: "", new: "", confirm: "" });
  const [pwDigits, setPwDigits] = React.useState<string[]>(Array(6).fill(""));
  const pwInputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  const requestPwMutation = useRequestPasswordUpdateMutation();
  const verifyPwMutation = useVerifyPasswordUpdateMutation();

  // ---- Email handlers ----
  const handleRequestEmailOTP = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmailError("");

    if (!newEmail.trim()) { setEmailError(t("errorEmailRequired")); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) { setEmailError(t("errorEmailInvalid")); return; }
    if (newEmail === user?.email) { setEmailError(t("errorEmailSame")); return; }

    requestEmailMutation.mutate(
      { new_email: newEmail },
      {
        onSuccess: () => {
          toast.success(`${t("toastOtpSent")} ${newEmail}`);
          setEmailStep("otp");
          setEmailDigits(Array(6).fill(""));
          setTimeout(() => emailInputRefs.current[0]?.focus(), 100);
        },
        onError: (err: unknown) => {
          const msg =
            (err as { response?: { data?: { message?: string } } })?.response
              ?.data?.message ?? t("toastOtpFailed");
          toast.error(msg);
        },
      },
    );
  };

  const submitEmailOTP = React.useCallback(
    (otp: string) => {
      verifyEmailMutation.mutate(
        { new_email: newEmail, otp },
        {
          onSuccess: () => {
            toast.success(t("toastEmailUpdated"));
            setEmailStep("idle");
            setNewEmail("");
            setEmailDigits(Array(6).fill(""));
          },
          onError: (err: unknown) => {
            const msg =
              (err as { response?: { data?: { message?: string } } })?.response
                ?.data?.message ?? t("toastOtpInvalid");
            toast.error(msg);
          },
        },
      );
    },
    [newEmail, verifyEmailMutation, toast, t],
  );

  const handleEmailDigitChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...emailDigits];
    next[index] = digit;
    setEmailDigits(next);
    if (digit && index < 5) emailInputRefs.current[index + 1]?.focus();
    if (digit && index === 5 && next.every((d) => d)) submitEmailOTP(next.join(""));
  };

  const handleEmailKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !emailDigits[index] && index > 0)
      emailInputRefs.current[index - 1]?.focus();
  };

  const handleEmailPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const next = Array(6).fill("");
    pasted.split("").forEach((char, i) => (next[i] = char));
    setEmailDigits(next);
    emailInputRefs.current[Math.min(pasted.length, 5)]?.focus();
    if (pasted.length === 6) submitEmailOTP(pasted);
  };

  const handleEmailVerifySubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const otp = emailDigits.join("");
    if (otp.length < 6) { toast.warning(t("toastOtpIncomplete")); return; }
    submitEmailOTP(otp);
  };

  const handleEmailResend = () => {
    requestEmailMutation.mutate(
      { new_email: newEmail },
      {
        onSuccess: () => {
          toast.success(`${t("toastOtpResent")} ${newEmail}`);
          setEmailDigits(Array(6).fill(""));
          setTimeout(() => emailInputRefs.current[0]?.focus(), 100);
        },
        onError: () => toast.error(t("toastResendFailed")),
      },
    );
  };

  // ---- Password handlers ----
  const handleRequestPasswordOTP = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors = { current: "", new: "", confirm: "" };
    if (!currentPassword) errors.current = t("errorCurrentPasswordRequired");
    if (!newPassword || newPassword.length < 8) errors.new = t("errorNewPasswordMin");
    if (newPassword !== confirmPassword) errors.confirm = t("errorPasswordMismatch");
    if (errors.current || errors.new || errors.confirm) { setPwErrors(errors); return; }
    setPwErrors({ current: "", new: "", confirm: "" });

    requestPwMutation.mutate(
      { current_password: currentPassword },
      {
        onSuccess: () => {
          toast.success(t("toastPasswordOtpSent"));
          setPwStep("otp");
          setPwDigits(Array(6).fill(""));
          setTimeout(() => pwInputRefs.current[0]?.focus(), 100);
        },
        onError: (err: unknown) => {
          const msg =
            (err as { response?: { data?: { message?: string } } })?.response
              ?.data?.message ?? t("toastOtpFailed");
          toast.error(msg);
        },
      },
    );
  };

  const submitPasswordOTP = React.useCallback(
    (otp: string) => {
      verifyPwMutation.mutate(
        { current_password: currentPassword, new_password: newPassword, confirm_password: confirmPassword, otp },
        {
          onSuccess: () => {
            toast.success(t("toastPasswordUpdated"));
            clearAuth();
            router.push("/login");
          },
          onError: (err: unknown) => {
            const msg =
              (err as { response?: { data?: { message?: string } } })?.response
                ?.data?.message ?? t("toastOtpInvalid");
            toast.error(msg);
          },
        },
      );
    },
    [currentPassword, newPassword, confirmPassword, verifyPwMutation, toast, t, clearAuth, router],
  );

  const handlePwDigitChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...pwDigits];
    next[index] = digit;
    setPwDigits(next);
    if (digit && index < 5) pwInputRefs.current[index + 1]?.focus();
    if (digit && index === 5 && next.every((d) => d)) submitPasswordOTP(next.join(""));
  };

  const handlePwKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !pwDigits[index] && index > 0)
      pwInputRefs.current[index - 1]?.focus();
  };

  const handlePwPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const next = Array(6).fill("");
    pasted.split("").forEach((char, i) => (next[i] = char));
    setPwDigits(next);
    pwInputRefs.current[Math.min(pasted.length, 5)]?.focus();
    if (pasted.length === 6) submitPasswordOTP(pasted);
  };

  const handlePwVerifySubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const otp = pwDigits.join("");
    if (otp.length < 6) { toast.warning(t("toastOtpIncomplete")); return; }
    submitPasswordOTP(otp);
  };

  const handlePwResend = () => {
    requestPwMutation.mutate(
      { current_password: currentPassword },
      {
        onSuccess: () => {
          toast.success(t("toastPasswordOtpSent"));
          setPwDigits(Array(6).fill(""));
          setTimeout(() => pwInputRefs.current[0]?.focus(), 100);
        },
        onError: () => toast.error(t("toastResendFailed")),
      },
    );
  };

  if (!user) return null;

  return (
    <div className="max-w-full mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">{t("title")}</h1>
        <p className="text-sm text-gray-500 mt-1">{t("subtitle")}</p>
      </div>

      {/* Account Info */}
      <Card className="p-6 border-none shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
          {t("accountInfo")}
        </h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
            <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <User size={16} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">{t("nameLabel")}</p>
              <p className="text-sm font-bold text-gray-900">{user.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
            <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Mail size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400 font-medium">{t("emailLabel")}</p>
              <p className="text-sm font-bold text-gray-900 truncate">{user.email}</p>
            </div>
            {user.is_verified && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-success bg-success/10 px-2.5 py-1 rounded-full shrink-0">
                <CheckCircle2 size={12} />
                {t("verified")}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
            <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Shield size={16} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">{t("roleLabel")}</p>
              <p className="text-sm font-bold text-gray-900 capitalize">{user.role}</p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Update Email */}
        <Card className="p-6 border-none shadow-sm space-y-5">
          <div>
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
              {t("updateEmail")}
            </h2>
            <p className="text-xs text-gray-400 mt-1">{t("updateEmailDesc")}</p>
          </div>

          <div className={cn("transition-all duration-300", emailStep === "otp" && "opacity-40 pointer-events-none select-none")}>
            <form onSubmit={handleRequestEmailOTP} className="space-y-4">
              <Input
                label={t("newEmailLabel")}
                type="email"
                placeholder="new@example.com"
                value={newEmail}
                onChange={(e) => { setNewEmail(e.target.value); setEmailError(""); }}
                error={emailError}
                leftIcon={<Mail size={15} />}
                disabled={requestEmailMutation.isPending || emailStep === "otp"}
              />
              <Button
                type="submit"
                variant="primary"
                loading={requestEmailMutation.isPending}
                rightIcon={<ArrowRight size={15} />}
                disabled={requestEmailMutation.isPending || emailStep === "otp"}>
                {t("sendOtp")}
              </Button>
            </form>
          </div>

          {emailStep === "otp" && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="rounded-xl bg-primary/5 border border-primary/20 px-4 py-3">
                <p className="text-sm text-gray-700">
                  {t("otpSentTo")}{" "}
                  <span className="font-bold text-primary">{newEmail}</span>
                </p>
              </div>

              <form onSubmit={handleEmailVerifySubmit} className="space-y-5">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">{t("enterOtp")}</p>
                  <div className="flex gap-2 justify-between">
                    {emailDigits.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => { emailInputRefs.current[i] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleEmailDigitChange(i, e.target.value)}
                        onKeyDown={(e) => handleEmailKeyDown(i, e)}
                        onPaste={handleEmailPaste}
                        disabled={verifyEmailMutation.isPending}
                        className={cn(
                          "w-11 h-12 text-center text-lg font-semibold rounded-lg border border-gray-300 bg-white",
                          "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                          "disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors duration-200 text-black",
                        )}
                      />
                    ))}
                  </div>
                </div>

                <Button type="submit" variant="primary" loading={verifyEmailMutation.isPending} className="w-full">
                  {t("verifyUpdate")}
                </Button>
              </form>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => { setEmailStep("idle"); setEmailDigits(Array(6).fill("")); }}
                  className="text-sm text-gray-400 hover:text-gray-700 transition-colors">
                  {t("changeEmail")}
                </button>
                <button
                  type="button"
                  onClick={handleEmailResend}
                  disabled={requestEmailMutation.isPending}
                  className="text-sm text-primary font-medium hover:underline disabled:opacity-50">
                  {requestEmailMutation.isPending ? t("sending") : t("resendOtp")}
                </button>
              </div>
            </div>
          )}
        </Card>

        {/* Update Password */}
        <Card className="p-6 border-none shadow-sm space-y-5">
          <div>
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
              {t("updatePassword")}
            </h2>
            <p className="text-xs text-gray-400 mt-1">{t("updatePasswordDesc")}</p>
          </div>

          <div className={cn("transition-all duration-300", pwStep === "otp" && "opacity-40 pointer-events-none select-none")}>
            <form onSubmit={handleRequestPasswordOTP} className="space-y-4">
              <Input
                label={t("currentPasswordLabel")}
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => { setCurrentPassword(e.target.value); setPwErrors((p) => ({ ...p, current: "" })); }}
                error={pwErrors.current}
                leftIcon={<LockKeyhole size={15} />}
                rightIcon={
                  <button type="button" onClick={() => setShowCurrent((v) => !v)} className="text-gray-400 hover:text-gray-600">
                    {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                }
                disabled={requestPwMutation.isPending || pwStep === "otp"}
              />
              <Input
                label={t("newPasswordLabel")}
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => { setNewPassword(e.target.value); setPwErrors((p) => ({ ...p, new: "" })); }}
                error={pwErrors.new}
                leftIcon={<LockKeyhole size={15} />}
                rightIcon={
                  <button type="button" onClick={() => setShowNew((v) => !v)} className="text-gray-400 hover:text-gray-600">
                    {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                }
                disabled={requestPwMutation.isPending || pwStep === "otp"}
              />
              <Input
                label={t("confirmPasswordLabel")}
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setPwErrors((p) => ({ ...p, confirm: "" })); }}
                error={pwErrors.confirm}
                leftIcon={<LockKeyhole size={15} />}
                rightIcon={
                  <button type="button" onClick={() => setShowConfirm((v) => !v)} className="text-gray-400 hover:text-gray-600">
                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                }
                disabled={requestPwMutation.isPending || pwStep === "otp"}
              />
              <Button
                type="submit"
                variant="primary"
                loading={requestPwMutation.isPending}
                rightIcon={<ArrowRight size={15} />}
                disabled={requestPwMutation.isPending || pwStep === "otp"}>
                {t("sendOtp")}
              </Button>
            </form>
          </div>

          {pwStep === "otp" && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="rounded-xl bg-primary/5 border border-primary/20 px-4 py-3">
                <p className="text-sm text-gray-700">{t("otpSentTo")} <span className="font-bold text-primary">{user.email}</span></p>
              </div>

              <form onSubmit={handlePwVerifySubmit} className="space-y-5">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">{t("enterOtp")}</p>
                  <div className="flex gap-2 justify-between">
                    {pwDigits.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => { pwInputRefs.current[i] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handlePwDigitChange(i, e.target.value)}
                        onKeyDown={(e) => handlePwKeyDown(i, e)}
                        onPaste={handlePwPaste}
                        disabled={verifyPwMutation.isPending}
                        className={cn(
                          "w-11 h-12 text-center text-lg font-semibold rounded-lg border border-gray-300 bg-white",
                          "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                          "disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors duration-200 text-black",
                        )}
                      />
                    ))}
                  </div>
                </div>

                <Button type="submit" variant="primary" loading={verifyPwMutation.isPending} className="w-full">
                  {t("verifyUpdatePassword")}
                </Button>
              </form>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => { setPwStep("idle"); setPwDigits(Array(6).fill("")); }}
                  className="text-sm text-gray-400 hover:text-gray-700 transition-colors">
                  {t("changePassword")}
                </button>
                <button
                  type="button"
                  onClick={handlePwResend}
                  disabled={requestPwMutation.isPending}
                  className="text-sm text-primary font-medium hover:underline disabled:opacity-50">
                  {requestPwMutation.isPending ? t("sending") : t("resendOtp")}
                </button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
