import * as z from "zod"

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

const usernameSchema = z.string().min(3, { message: "username must be minimum of 3 characters" })

export const messageImputSchema = z.object({
  username: usernameSchema,
  message: z.string()
})

export type messageInputProps = z.infer<typeof messageImputSchema>
