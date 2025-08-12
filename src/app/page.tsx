import { Suspense } from 'react'

// 使用 fetch API 获取数据
async function fetchUserData() {
  try {
    // 使用 JSONPlaceholder API 获取用户数据
    await new Promise(resolve => setTimeout(resolve, 10000))
    const response = await fetch('https://jsonplaceholder.typicode.com/users/1', { cache: 'no-store' })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const user = await response.json()
    
    return {
      id: user.id,
      name: '张三我是张三',
      email: user.email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`
    }
  } catch (error) {
    console.error('Error fetching user data:', error)
    throw new Error('Failed to fetch user data')
  }
}

// 文章类型定义
interface Post {
  id: number
  title: string
  content: string
  date: string
}

// API 返回的文章类型
interface ApiPost {
  id: number
  title: string
  body: string
}

async function fetchPosts() {
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    // 使用 JSONPlaceholder API 获取文章数据
    const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=3', { cache: 'no-store' })
    console.log('fetchPosts')
    console.log(response)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const posts = await response.json()
    
    return posts.map((post: ApiPost, index: number) => ({
      id: post.id,
      title: post.title,
      content: post.body.substring(0, 100) + '...',
      date: new Date(Date.now() - index * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }))
  } catch (error) {
    console.error('Error fetching posts:', error)
    throw new Error('Failed to fetch posts')
  }
}

// 用户信息组件
async function UserProfile() {
  const user = await fetchUserData()
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center space-x-4">
        <img 
          src={user.avatar} 
          alt={user.name}
          className="w-16 h-16 rounded-full"
        />
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
          <p className="text-gray-600">{user.email}</p>
        </div>
      </div>
    </div>
  )
}

// 文章列表组件
async function PostsList() {
  const posts = await fetchPosts()
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">最新文章</h3>
      <div className="space-y-4">
        {posts.map((post: Post) => (
          <article key={post.id} className="border-b border-gray-200 pb-4 last:border-b-0">
            <h4 className="text-md font-medium text-gray-900 mb-2">{post.title}</h4>
            <p className="text-gray-600 text-sm mb-2">{post.content}</p>
            <time className="text-xs text-gray-500">{post.date}</time>
          </article>
        ))}
      </div>
    </div>
  )
}

// 加载骨架屏组件
function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-200 rounded-lg p-6 mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded w-24"></div>
            <div className="h-3 bg-gray-300 rounded w-32"></div>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-200 rounded-lg p-6">
        <div className="h-5 bg-gray-300 rounded w-20 mb-4"></div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="border-b border-gray-300 pb-4 last:border-b-0">
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// 错误边界组件
function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-red-800 mb-2">加载失败</h3>
      <p className="text-red-600">{error.message}</p>
    </div>
  )
}

export default function StreamPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Suspense 示例
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 用户信息区域 */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">用户信息</h2>
            <Suspense fallback={<LoadingSkeleton />}>
              <UserProfile />
            </Suspense>
          </div>
          
          {/* 文章列表区域 */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">文章列表</h2>
            <Suspense fallback={<LoadingSkeleton />}>
              <PostsList />
            </Suspense>
          </div>
        </div>
        
        {/* 说明文字 */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Suspense 特性说明</h3>
          <ul className="text-blue-700 space-y-1 text-sm">
            <li>• 使用 Suspense 包装异步组件，提供加载状态</li>
            <li>• 支持流式渲染，提升用户体验</li>
            <li>• 可以并行加载多个异步组件</li>
            <li>• 每个 Suspense 边界可以独立加载</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
