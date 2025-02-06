import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HomePage() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1 className="text-4xl font-bold mb-4">Bienvenido a LogisticsPro</h1>
        <p className="text-xl mb-4">Tu sistema de logística de paquetes</p>
        <Link href="/dashboard">
          <Button>Ir al Dashboard</Button>
        </Link>
      </div>
    </Layout>
  )
}

