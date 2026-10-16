import userApi from '@/api/routes/userApi'
import { useQuery } from '@tanstack/react-query'

export default function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: userApi.getAllUsers,
  })
}
