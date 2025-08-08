'use client';

import { Suspense } from 'react';

// 模拟异步数据获取
const fetchUserProfile = async (userId) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    id: userId,
    name: `用户 ${userId}`,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
    email: `user${userId}@example.com`
  };
};

const fetchUserPosts = async (userId) => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  return [
    { id: 1, title: '我的第一篇博客', content: '这是用户的第一篇博客内容...' },
    { id: 2, title: '技术分享', content: '今天分享一些技术心得...' },
    { id: 3, title: '学习笔记', content: 'React 18 的新特性学习...' }
  ];
};

const fetchUserComments = async (userId) => {
  await new Promise(resolve => setTimeout(resolve, 3000));
  return [
    { id: 1, text: '很好的分享！', author: '评论者1' },
    { id: 2, text: '学习了，谢谢', author: '评论者2' },
    { id: 3, text: '期待更多内容', author: '评论者3' }
  ];
};

// 用户资料组件
const UserProfile = async ({ userId }) => {
  const user = await fetchUserProfile(userId);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center space-x-4">
        <img 
          src={user.avatar} 
          alt={user.name}
          className="w-16 h-16 rounded-full"
        />
        <div>
          <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
          <p className="text-gray-600">{user.email}</p>
        </div>
      </div>
    </div>
  );
};

// 用户文章组件
const UserPosts = async ({ userId }) => {
  const posts = await fetchUserPosts(userId);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">用户文章</h3>
      <div className="space-y-4">
        {posts.map(post => (
          <div key={post.id} className="border-b pb-4 last:border-b-0">
            <h4 className="font-medium text-gray-800">{post.title}</h4>
            <p className="text-gray-600 text-sm mt-1">{post.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// 用户评论组件
const UserComments = async ({ userId }) => {
  const comments = await fetchUserComments(userId);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">用户评论</h3>
      <div className="space-y-3">
        {comments.map(comment => (
          <div key={comment.id} className="bg-gray-50 p-3 rounded">
            <p className="text-gray-800">{comment.text}</p>
            <p className="text-gray-500 text-sm mt-1">- {comment.author}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// 加载状态组件
const LoadingSpinner = ({ message }) => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    <span className="ml-3 text-gray-600">{message}</span>
  </div>
);

// 主页面组件
export default function StreamPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          服务器端流式渲染示例
        </h1>
        
        <div className="max-w-4xl mx-auto">
          {/* 用户资料 - 加载最快 */}
          <Suspense fallback={<LoadingSpinner message="正在加载用户资料..." />}>
            <UserProfile userId={1} />
          </Suspense>
          
          {/* 用户文章 - 中等加载时间 */}
          <Suspense fallback={<LoadingSpinner message="正在加载用户文章..." />}>
            <UserPosts userId={1} />
          </Suspense>
          
          {/* 用户评论 - 加载最慢 */}
          <Suspense fallback={<LoadingSpinner message="正在加载用户评论..." />}>
            <UserComments userId={1} />
          </Suspense>
          
          {/* 说明部分 */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-blue-800 font-semibold mb-4">流式渲染工作原理：</h3>
            <div className="space-y-3 text-blue-700 text-sm">
              <div className="flex items-start space-x-2">
                <span className="font-medium">1.</span>
                <p>服务器立即开始渲染页面结构（HTML shell）</p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="font-medium">2.</span>
                <p>用户资料组件先加载完成，立即发送到客户端显示</p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="font-medium">3.</span>
                <p>文章组件加载完成后，作为流的一部分发送</p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="font-medium">4.</span>
                <p>评论组件最后加载完成，完成整个页面</p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="font-medium">5.</span>
                <p>客户端逐步接收并显示内容，无需等待所有数据</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-green-800 font-semibold mb-4">流式渲染的优势：</h3>
            <ul className="text-green-700 space-y-2 text-sm">
              <li>• <strong>更快的首屏显示</strong>：不需要等待所有数据加载完成</li>
              <li>• <strong>更好的用户体验</strong>：内容逐步出现，减少等待感</li>
              <li>• <strong>更高的并发性能</strong>：可以同时处理多个请求</li>
              <li>• <strong>更好的 SEO</strong>：搜索引擎可以更快地索引内容</li>
              <li>• <strong>渐进式加载</strong>：重要内容优先显示</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 