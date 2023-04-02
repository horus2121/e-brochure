import { EventModal } from '@/components/EventModal'
import { Button, buttonVariants } from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import useCurrentUser from '@/hooks/useCurrentUser'
import useEvents from '@/hooks/useEvents'
import { useToast } from '@/hooks/useToast'
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar'
import axios from 'axios'
import type { NextPage } from 'next'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useState } from 'react'

const Home: NextPage = () => {
  const { data: session, status } = useSession()
  const { data: currentUser } = useCurrentUser()

  const { data: events = [] } = useEvents()

  console.log('events :::: ', events)

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [name, setName] = useState<string>(currentUser?.name)

  const { toast } = useToast()

  const onSubmit = useCallback(async () => {
    try {
      setIsLoading(true)

      await axios.patch('/api/edituser', {
        name,
      })

      toast({
        variant: 'success',
        description: 'Name updated',
      })
    } catch (error) {
      toast({
        variant: 'destructive',
        description: 'Something went wrong',
      })
    } finally {
      setIsLoading(false)
    }
  }, [name])

  if (status === 'authenticated') {
    return (
      <div className="flex text-center space-y-4 min-h-screen flex-col bg-[url('/noise.png')] items-center justify-center py-2 bg-[#18191b] text-white">
        {currentUser && (
          <Avatar className="uppercase rounded-full">
            <AvatarImage
              className="rounded-full h-10"
              src={currentUser?.image}
              alt=""
            />
            <AvatarFallback className="bg-[#16181A] px-3 py-2 border-gray-400 border rounded-full">
              {currentUser?.name.match(/\b(\w)/g).join(' ')}
            </AvatarFallback>
          </Avatar>
        )}
        <p>
          Signed in as {currentUser?.email} & {currentUser?.name}
        </p>
        <Button className="my-2" onClick={() => signOut()}>
          Sign out
        </Button>
        <Button
          className="my-2"
          onClick={() =>
            toast({
              variant: 'success',
              description: 'Hello',
            })
          }
        >
          Click me
        </Button>
        <Input
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
        <Button onClick={onSubmit} className="my-2">
          Edit Name
        </Button>
        <EventModal />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-[url('/noise.png')] items-center justify-center py-2 bg-[#18191b] text-white">
      <Link
        className={buttonVariants({
          variant: 'default',
        })}
        href="/auth/signin"
      >
        Sign in
      </Link>
    </div>
  )
}

export default Home
