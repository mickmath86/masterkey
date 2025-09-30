export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div >
    
      <main className="text-gray-950 antialiased flex flex-col h-screen mt-4">
        <div className="flex justify-center">
        <h1 className="text-3xl font-bold">MASTERKEY</h1>
        </div>
       
    

        {children}
     
      </main>
    </div>
  )
}
