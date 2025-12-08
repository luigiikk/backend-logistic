import { sendSupportEmailAction } from "@/action/sendSupportEmailAction.js";



interface sendSupportParams {
  name: string;
  email: string;
  phone: string;
  message: string;
  subject: string;
}


export async function supportService({
  name,
  email,
  phone,
  message,
  subject
}: sendSupportParams) {

  await sendSupportEmailAction({ name, email, phone, message, subject });
  return { success: true };
}