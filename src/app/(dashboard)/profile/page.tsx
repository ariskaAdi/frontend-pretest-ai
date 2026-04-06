"use client";

import * as React from "react";
import { Mail, User, Shield, CheckCircle2, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/shared/Card";
import { Input } from "@/components/shared/Input";
import { Button } from "@/components/shared/Button";
import { useToast } from "@/components/shared/Toast";
import { useGetMeQuery } from "@/queries/useUserQuery";
import {
  useRequestEmailUpdateMutation,
  useVerifyEmailUpdateMutation,
} from "@/queries/useUserQuery";
import { cn } from "@/lib/utils";

type Step = "idle" | "otp";

export default function ProfilePage() {
  const t = useTranslations("ProfilePage");
  const { data: user } = useGetMeQuery();
  const { toast } = useToast();

  const [step, setStep] = React.useState<Step>("idle");
  const [newEmail, setNewEmail] = React.useState("");
  const [emailError, setEmailError] = React.useState("");
  const [digits, setDigits] = React.useState<string[]>(Array(6).fill(""));
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  const requestMutation = useRequestEmailUpdateMutation();
  const verifyMutation = useVerifyEmailUpdateMutation();

  const handleRequestOTP = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmailError("");

    if (!newEmail.trim()) { setEmailError(t("errorEmailRequired")); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) { setEmailError(t("errorEmailInvalid")); return; }
    if (newEmail === user?.email) { setEmailError(t("errorEmailSame")); return; }

    requestMutation.mutate(
      { new_email: newEmail },
      {
        onSuccess: () => {
          toast.success(`${t("toastOtpSent")} ${newEmail}`);
          setStep("otp");
          setDigits(Array(6).fill(""));
          setTimeout(() => inputRefs.current[0]?.focus(), 100);
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

  const submitOTP = React.useCallback(
    (otp: string) => {
      verifyMutation.mutate(
        { new_email: newEmail, otp },
        {
          onSuccess: () => {
            toast.success(t("toastEmailUpdated"));
            setStep("idle");
            setNewEmail("");
            setDigits(Array(6).fill(""));
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
    [newEmail, verifyMutation, toast, t],
  );

  const handleDigitChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);

    if (digit && index < 5) inputRefs.current[index + 1]?.focus();
    if (digit && index === 5 && next.every((d) => d)) submitOTP(next.join(""));
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const next = Array(6).fill("");
    pasted.split("").forEach((char, i) => (next[i] = char));
    setDigits(next);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
    if (pasted.length === 6) submitOTP(pasted);
  };

  const handleVerifySubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const otp = digits.join("");
    if (otp.length < 6) { toast.warning(t("toastOtpIncomplete")); return; }
    submitOTP(otp);
  };

  const handleResend = () => {
    requestMutation.mutate(
      { new_email: newEmail },
      {
        onSuccess: () => {
          toast.success(`${t("toastOtpResent")} ${newEmail}`);
          setDigits(Array(6).fill(""));
          setTimeout(() => inputRefs.current[0]?.focus(), 100);
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

      {/* Update Email */}
      <Card className="p-6 border-none shadow-sm space-y-5">
        <div>
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
            {t("updateEmail")}
          </h2>
          <p className="text-xs text-gray-400 mt-1">{t("updateEmailDesc")}</p>
        </div>

        {/* Step 1 */}
        <div className={cn("transition-all duration-300", step === "otp" && "opacity-40 pointer-events-none select-none")}>
          <form onSubmit={handleRequestOTP} className="space-y-4">
            <Input
              label={t("newEmailLabel")}
              type="email"
              placeholder="new@example.com"
              value={newEmail}
              onChange={(e) => { setNewEmail(e.target.value); setEmailError(""); }}
              error={emailError}
              leftIcon={<Mail size={15} />}
              disabled={requestMutation.isPending || step === "otp"}
            />
            <Button
              type="submit"
              variant="primary"
              loading={requestMutation.isPending}
              rightIcon={<ArrowRight size={15} />}
              disabled={requestMutation.isPending || step === "otp"}>
              {t("sendOtp")}
            </Button>
          </form>
        </div>

        {/* Step 2 */}
        {step === "otp" && (
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="rounded-xl bg-primary/5 border border-primary/20 px-4 py-3">
              <p className="text-sm text-gray-700">
                {t("otpSentTo")}{" "}
                <span className="font-bold text-primary">{newEmail}</span>
              </p>
            </div>

            <form onSubmit={handleVerifySubmit} className="space-y-5">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">{t("enterOtp")}</p>
                <div className="flex gap-2 justify-between">
                  {digits.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { inputRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(i, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(i, e)}
                      onPaste={handlePaste}
                      disabled={verifyMutation.isPending}
                      className={cn(
                        "w-11 h-12 text-center text-lg font-semibold rounded-lg border border-gray-300 bg-white",
                        "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                        "disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors duration-200 text-black",
                      )}
                    />
                  ))}
                </div>
              </div>

              <Button type="submit" variant="primary" loading={verifyMutation.isPending} className="w-full">
                {t("verifyUpdate")}
              </Button>
            </form>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => { setStep("idle"); setDigits(Array(6).fill("")); }}
                className="text-sm text-gray-400 hover:text-gray-700 transition-colors">
                {t("changeEmail")}
              </button>
              <button
                type="button"
                onClick={handleResend}
                disabled={requestMutation.isPending}
                className="text-sm text-primary font-medium hover:underline disabled:opacity-50">
                {requestMutation.isPending ? t("sending") : t("resendOtp")}
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
