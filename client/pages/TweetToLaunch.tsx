import { Twitter, Rocket, Clock } from "lucide-react";

export default function TweetToLaunch() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-6xl animate-bounce">
          🐑
        </div>
        <div className="absolute top-40 right-20 text-4xl animate-pulse">
          🚗
        </div>
        <div className="absolute bottom-32 left-1/4 text-5xl animate-spin-slow">
          💨
        </div>
        <div className="absolute top-1/3 right-1/3 text-3xl animate-bounce">
          🚀
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <img
              src="/lamb-car.png"
              alt="LAMBAAAGHINI"
              className="w-16 h-16 object-contain"
            />
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-purple-600 bg-clip-text text-transparent">
              Tweet-to-Launch
            </h1>
            <Twitter className="w-12 h-12 text-blue-500" />
          </div>

          {/* Coming Soon Badge */}
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-6 py-3 rounded-full mb-8 shadow-lg">
            <Clock className="w-5 h-5" />
            <span className="font-semibold text-lg">Coming Soon</span>
          </div>

          {/* Description */}
          <p className="text-xl text-gray-700 mb-8 leading-relaxed">
            🐑 Launch tokens instantly by tweeting! Just mention us with your
            token name and ticker, and we'll deploy it automatically on
            pump.fun! 🚗💨
          </p>

          {/* Feature Preview */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-orange-200 mb-8">
            <Rocket className="w-12 h-12 text-orange-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Revolutionary Token Launch
            </h3>
            <p className="text-gray-600 mb-6">
              Simply tweet your token name and ticker, and our advanced system
              will automatically deploy your token on pump.fun. No complicated
              forms, no technical knowledge required!
            </p>
            <div className="text-sm text-orange-600 font-medium">
              Stay tuned for the most innovative token launch experience! 🚀
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-gray-600">
            <p className="text-lg">
              🐑 Powered by LAMBAAAGHINI - Where Sheep Meet Supercars! 🚗
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
