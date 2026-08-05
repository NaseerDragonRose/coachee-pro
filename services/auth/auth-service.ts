export type Session = {
  id: string
  email: string
  name: string
}

export interface AuthService {
  getSession(): Promise<Session | null>
}
