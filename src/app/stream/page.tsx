'use client';

import { Suspense, useState } from 'react';

// 模拟异步数据获取
const fetchUserData = async (userId: number) => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    id: userId,
    name: `用户 ${userId}`,
    email: `user${userId}@example.com`,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
    joinDate: new Date().toLocaleDateString('zh-CN')
  };
};

// 异步用户数据组件
const UserProfile = async ({ userId }: { userId: number }) => {
  const userData = await fetchUserData(userId);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <div className="flex items-center space-x-4">
        <img 
          src={userData.avatar} 
          alt={userData.name}
          className="w-16 h-16 rounded-full"
        />
        <div>
          <h2 className="text-xl font-bold text-gray-800">{userData.name}</h2>
          <p className="text-gray-600">{userData.email}</p>
          <p className="text-sm text-gray-500">加入时间: {userData.joinDate}</p>
        </div>
      </div>
    </div>
  );
};

// 加载状态组件
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    <span className="ml-3 text-gray-600">正在加载用户数据...</span>
  </div>
);

// 错误边界组件
const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
    <h3 className="text-red-800 font-semibold">加载失败</h3>
    <p className="text-red-600 mt-2">{error.message}</p>
    <button 
      onClick={resetErrorBoundary}
      className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
    >
      重试
    </button>
  </div>
);

// 用户列表组件
const UserList = () => {
  const [selectedUserId, setSelectedUserId] = useState(1);
  
  return (
    <div className="space-y-4">
      <div className="flex space-x-2 justify-center">
        {[1, 2, 3, 4, 5].map(userId => (
          <button
            key={userId}
            onClick={() => setSelectedUserId(userId)}
            className={`px-4 py-2 rounded ${
              selectedUserId === userId 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            用户 {userId}
          </button>
        ))}
      </div>
      
      <Suspense fallback={<LoadingSpinner />}>
        <UserProfile userId={selectedUserId} />
      </Suspense>
    </div>
  );
};

// 主页面组件
export default function StreamPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Suspense 示例
        </h1>
        
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">异步数据加载演示</h2>
            <p className="text-gray-600 mb-4">
              点击下面的用户按钮来切换不同的用户数据。每次切换都会触发异步数据加载，
              Suspense 会显示加载状态直到数据加载完成。
            </p>
            
            <UserList />
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-blue-800 font-semibold mb-2">Suspense 特性说明：</h3>
            <ul className="text-blue-700 space-y-1 text-sm">
              <li>• 异步组件加载时显示 fallback 内容</li>
              <li>• 数据加载完成后自动渲染组件</li>
              <li>• 支持错误边界处理加载失败</li>
              <li>• 提供更好的用户体验</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
