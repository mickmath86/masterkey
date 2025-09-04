import { Container } from "lucide-react"
import { Navbar } from "./navbar"
import { Subheading } from "./text"
import { Heading } from "./text"
import { Lead } from "./text"



 export function SectionHeader({subHead, heading, lead}: {subHead: string, heading: string, lead: string}) {
    return(
    <Container>
    
        <Subheading className="mt-16">Test</Subheading>
        <Heading as="h1" className="mt-2">
          {heading}
        </Heading>
        <Lead className="mt-6 max-w-3xl">
         {lead}
        </Lead>
      </Container>
)
 }