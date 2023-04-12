import { FC, useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import Image from 'next/image'

import useEvents from '@/hooks/useEvents'
import { useToast } from '@/hooks/useToast'

import { Typography } from './ui/Typography'
import useLike from '@/hooks/useLike'
import useCurrentUser from '@/hooks/useCurrentUser'

interface EventCardProps {
  eventId: string
  thumbnail?: string
  eventName: string
  eventDescription?: string
  isFavorite: boolean
  userId?: string
}

const EventCard: FC<EventCardProps> = ({
  eventId,
  thumbnail,
  eventName,
  eventDescription,
  isFavorite,
  userId,
}) => {
  const { mutate: mutateEvents } = useEvents()
  const { toast } = useToast()
  const { data: currentUser } = useCurrentUser()
  const [likes, setLikes] = useState(0)
  const router = useRouter()

  const { toggleLike, likeCount } = useLike({ eventId: eventId, userId })

  useEffect(() => {
    likeCount().then((count) => {
      setLikes(count)
    })
  }, [toggleLike])

  const onLike = useCallback(
    async (ev: any) => {
      ev.stopPropagation()

      if (!currentUser) {
        return router.push('/signup')
      }

      toggleLike()
    },
    [currentUser, toggleLike],
  )

  const LikeIcon = likes ? AiFillHeart : AiOutlineHeart

  const navigateToEventPage = () => {
    router.push(`/events/${eventId}`)
  }

  return (
    <div
      onClick={navigateToEventPage}
      className="flex p-2 mb-4 bg-white border rounded shadow-md border-slate-100"
    >
      <div className="rounded">
        <Image
          src={thumbnail || '/thumbnail-placeholder.svg'}
          width={92}
          height={92}
          alt={eventName}
        />
      </div>
      <div className="w-7/12 ml-4 text-left">
        <Typography variant="subhead2" children={eventName} />
        <Typography variant="bodytext1" children={eventDescription} />
      </div>
      <div className="flex items-center space-x-1 h-fit" onClick={onLike}>
        <LikeIcon color={likes ? 'red' : ''} size={20} />
        <Typography variant="bodytext1">{likes}</Typography>
      </div>
    </div>
  )
}

export default EventCard
