import { useAccount } from 'wagmi'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const ProfilePage = () => {
  const { address: account } = useAccount()
  const router = useRouter()

  useEffect(() => {
    if (account) {
      router.push(`/profile/${account.toLowerCase()}`)
    }
  }, [account, router])

  return null
}

export default ProfilePage
