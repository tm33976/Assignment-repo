"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Loader2, LogOut, Search, Edit, Trash2 } from "lucide-react"
import UserEditDialog from "@/components/user-edit-dialog"

interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  avatar: string
}

interface ApiResponse {
  page: number
  per_page: number
  total: number
  total_pages: number
  data: User[]
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const { isAuthenticated, logout } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    } else {
      fetchUsers(currentPage)
    }
  }, [isAuthenticated, currentPage, router])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users)
    } else {
      const filtered = users.filter(
        (user) =>
          user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredUsers(filtered)
    }
  }, [searchQuery, users])

  const fetchUsers = async (page: number) => {
    setIsLoading(true)
    try {
      const response = await fetch(`https://reqres.in/api/users?page=${page}`)
      if (!response.ok) {
        throw new Error("Failed to fetch users")
      }
      const data: ApiResponse = await response.json()
      setUsers(data.data)
      setFilteredUsers(data.data)
      setTotalPages(data.total_pages)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
  }

  const handleDeleteUser = async (id: number) => {
    try {
      const response = await fetch(`https://reqres.in/api/users/${id}`, {
        method: "DELETE",
      })

      if (!response.ok && response.status !== 204) {
        throw new Error("Failed to delete user")
      }

      // Update UI by removing the user
      setUsers(users.filter((user) => user.id !== id))
      setFilteredUsers(filteredUsers.filter((user) => user.id !== id))

      toast({
        title: "Success",
        description: "User deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      })
    }
  }

  const handleUpdateUser = async (updatedUser: User) => {
    try {
      const response = await fetch(`https://reqres.in/api/users/${updatedUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      })

      if (!response.ok) {
        throw new Error("Failed to update user")
      }

      // Update the users list with the updated user
      setUsers(users.map((user) => (user.id === updatedUser.id ? updatedUser : user)))
      setFilteredUsers(filteredUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user)))

      setEditingUser(null)
      toast({
        title: "Success",
        description: "User updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>User Management</CardTitle>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Avatar</TableHead>
                      <TableHead>First Name</TableHead>
                      <TableHead>Last Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          No users found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <img
                              src={user.avatar || "/placeholder.svg"}
                              alt={`${user.first_name} ${user.last_name}`}
                              className="h-10 w-10 rounded-full"
                            />
                          </TableCell>
                          <TableCell>{user.first_name}</TableCell>
                          <TableCell>{user.last_name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => handleEditUser(user)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteUser(user.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              <Pagination className="mt-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink onClick={() => setCurrentPage(page)} isActive={currentPage === page}>
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </>
          )}
        </CardContent>
      </Card>

      {editingUser && (
        <UserEditDialog user={editingUser} onClose={() => setEditingUser(null)} onUpdate={handleUpdateUser} />
      )}
    </div>
  )
}

