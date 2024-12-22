import AcmeLogo from '@/app/ui/acme-logo'
import LoginForm from '@/app/ui/login-form'

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-[400px]">
        <div className="flex justify-center mb-8">
          <div className="w-32">
            <AcmeLogo />
          </div>
        </div>
        <LoginForm />
      </div>
    </main>
  )
}
