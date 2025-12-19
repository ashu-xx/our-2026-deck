export function renderLoginView({ app, isLocalDev, onSubmit }) {
  app.innerHTML = `
    <div class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-800 via-green-700 to-green-900 relative overflow-hidden">
        <div class="fixed top-10 left-10 text-6xl animate-float opacity-30">🎄</div>
        <div class="fixed top-20 right-20 text-5xl animate-float-reverse opacity-30">❄️</div>
        <div class="fixed bottom-20 left-1/4 text-5xl animate-float opacity-30">🌸</div>
        <div class="fixed bottom-32 right-1/4 text-6xl animate-float-reverse opacity-30">🦋</div>
        <div class="fixed top-1/2 left-10 text-4xl animate-sparkle opacity-20">✨</div>
        <div class="fixed top-1/2 right-10 text-4xl animate-sparkle opacity-20">💫</div>
        <div class="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border-4 border-yellow-400 relative z-10 animate-slide-in">
            <div class="text-center mb-8">
              <div class="text-7xl mb-4 animate-float">💝</div>
              <h1 class="font-festive text-5xl mb-2 bg-gradient-to-r from-green-700 to-green-900 bg-clip-text text-transparent">Our 2026 Journey</h1>
              <p class="font-script text-xl text-gray-600 italic mt-2">A year of love and adventure</p>
              <div class="mt-4 flex justify-center gap-3 text-3xl">
                <span class="animate-float">🦊</span>
                <span class="animate-float-reverse">🌺</span>
                <span class="animate-float">🎴</span>
              </div>
            </div>
            ${isLocalDev ? `
            <div class="bg-yellow-50 border-2 border-yellow-400 text-yellow-800 px-4 py-3 rounded-xl mb-6 text-xs">
              <div class="flex items-start space-x-2">
                <span class="text-lg">🔧</span>
                <div class="w-full">
                  <strong class="block mb-2">Local Dev Mode - Test Accounts</strong>
                  <div class="space-y-1">
                    <div class="flex justify-between items-center bg-blue-100 px-2 py-1 rounded">
                      <span class="font-semibold">👤 Alice:</span> 
                      <span class="font-mono text-xs">alice@example.com / alice123</span>
                    </div>
                    <div class="flex justify-between items-center bg-green-100 px-2 py-1 rounded">
                      <span class="font-semibold">👤 Bob:</span> 
                      <span class="font-mono text-xs">bob@example.com / bob123</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            ` : ''}
            <form id="loginForm" class="space-y-5">
                <div class="relative">
                  <label class="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Email Address</label>
                  <div class="relative">
                    <span class="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl">✉️</span>
                    <input 
                      type="email" 
                      id="email" 
                      placeholder="Enter your email" 
                      class="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl text-black focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition-all placeholder-gray-400"
                      required
                    >
                  </div>
                </div>
                <div class="relative">
                  <label class="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Password</label>
                  <div class="relative">
                    <span class="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl">🔑</span>
                    <input 
                      type="password" 
                      id="password" 
                      placeholder="Enter your password" 
                      class="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl text-black focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition-all placeholder-gray-400"
                      required
                    >
                  </div>
                </div>
                <button 
                  type="submit" 
                  class="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-4 rounded-xl font-bold text-lg hover:from-red-600 hover:to-red-700 transition-all shadow-lg transform hover:scale-[1.02] active:scale-[0.98] mt-6"
                >
                  <span class="flex items-center justify-center space-x-2">
                    <span>Open Your Gift</span>
                    <span>🎁</span>
                  </span>
                </button>
            </form>
            <div class="mt-8 text-center border-t-2 border-gray-100 pt-6">
              <p class="font-script text-lg text-gray-600 mb-2">Made with love for the adventures ahead</p>
              <div class="text-2xl">✨💕✨</div>
            </div>
        </div>
        <div class="fixed bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
    </div>`

  const form = app.querySelector('#loginForm')
  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const email = form.email.value.trim().toLowerCase()
    const password = form.password.value
    onSubmit({ email, password })
  })
}

