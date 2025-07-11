import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Play,
  CheckCircle,
  Lock,
  Star,
  Award,
  GraduationCap,
  Users,
  Clock,
  TrendingUp,
  Shield,
  Zap,
} from "lucide-react";

interface Course {
  id: string;
  title: string;
  description: string;
  level: "beginner" | "intermediate" | "advanced";
  duration: string;
  lessons: number;
  enrolled: number;
  rating: number;
  completed: boolean;
  progress: number;
  category: string;
  thumbnail: string;
}

interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  locked: boolean;
}

const MOCK_COURSES: Course[] = [
  {
    id: "1",
    title: "DeFi Basics for Baby Sheep",
    description:
      "Learn the fundamentals of decentralized finance with simple sheep metaphors that even a lamb can understand!",
    level: "beginner",
    duration: "2 hours",
    lessons: 8,
    enrolled: 1420,
    rating: 4.8,
    completed: false,
    progress: 37.5,
    category: "Fundamentals",
    thumbnail: "🐑",
  },
  {
    id: "2",
    title: "Smart Contract Security: Don't Get Fleeced",
    description:
      "Protect yourself from scams and rug pulls. Learn how to identify safe contracts and avoid losing your wool!",
    level: "intermediate",
    duration: "3 hours",
    lessons: 12,
    enrolled: 890,
    rating: 4.9,
    completed: true,
    progress: 100,
    category: "Security",
    thumbnail: "🛡️",
  },
  {
    id: "3",
    title: "Advanced Yield Farming Strategies",
    description:
      "Master the art of yield farming like an alpha sheep. Learn advanced strategies to maximize your fleece income!",
    level: "advanced",
    duration: "5 hours",
    lessons: 20,
    enrolled: 456,
    rating: 4.7,
    completed: false,
    progress: 0,
    category: "Yield Farming",
    thumbnail: "🚜",
  },
  {
    id: "4",
    title: "NFT Trading for Sheep",
    description:
      "Discover the world of NFTs and learn how to trade digital collectibles without getting sheared!",
    level: "beginner",
    duration: "2.5 hours",
    lessons: 10,
    enrolled: 1156,
    rating: 4.6,
    completed: false,
    progress: 60,
    category: "NFTs",
    thumbnail: "🖼️",
  },
  {
    id: "5",
    title: "Liquidity Pool Mastery",
    description:
      "Dive deep into liquidity pools and learn how to provide liquidity like a professional shepherd!",
    level: "intermediate",
    duration: "4 hours",
    lessons: 15,
    enrolled: 723,
    rating: 4.8,
    completed: false,
    progress: 13.3,
    category: "Liquidity",
    thumbnail: "💧",
  },
  {
    id: "6",
    title: "Reading Charts: Sheep Technical Analysis",
    description:
      "Learn to read price charts and technical indicators to predict market movements like a fortune-telling sheep!",
    level: "intermediate",
    duration: "3.5 hours",
    lessons: 14,
    enrolled: 942,
    rating: 4.7,
    completed: false,
    progress: 0,
    category: "Trading",
    thumbnail: "📊",
  },
];

const MOCK_LESSONS: Lesson[] = [
  {
    id: "1",
    title: "What is DeFi? (Sheep Edition)",
    duration: "15 min",
    completed: true,
    locked: false,
  },
  {
    id: "2",
    title: "Understanding Blockchain Basics",
    duration: "20 min",
    completed: true,
    locked: false,
  },
  {
    id: "3",
    title: "Your First Wallet Setup",
    duration: "18 min",
    completed: true,
    locked: false,
  },
  {
    id: "4",
    title: "Connecting to DEX Platforms",
    duration: "22 min",
    completed: false,
    locked: false,
  },
  {
    id: "5",
    title: "Making Your First Swap",
    duration: "25 min",
    completed: false,
    locked: false,
  },
  {
    id: "6",
    title: "Understanding Gas Fees",
    duration: "16 min",
    completed: false,
    locked: true,
  },
  {
    id: "7",
    title: "Risk Management Strategies",
    duration: "30 min",
    completed: false,
    locked: true,
  },
  {
    id: "8",
    title: "Building Your Portfolio",
    duration: "28 min",
    completed: false,
    locked: true,
  },
];

export default function Academy() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = [
    "All",
    ...Array.from(new Set(MOCK_COURSES.map((course) => course.category))),
  ];

  const filteredCourses =
    selectedCategory === "All"
      ? MOCK_COURSES
      : MOCK_COURSES.filter((course) => course.category === selectedCategory);

  const getLevelColor = (level: Course["level"]) => {
    switch (level) {
      case "beginner":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "intermediate":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "advanced":
        return "bg-red-500/20 text-red-400 border-red-500/30";
    }
  };

  return (
    <div className="min-h-screen px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-8">
          <Badge className="mb-6 bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20">
            🎓📚 Sheep Academy - Learn DeFi Like a Pro Sheep
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            <span className="text-blue-400 drop-shadow-lg font-bold">
              SHEEP
            </span>{" "}
            <span className="text-gold-400 drop-shadow-lg font-bold">
              ACADEMY
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Master DeFi trading with our comprehensive sheep-themed courses!
            Learn from basic blockchain concepts to advanced yield farming
            strategies. Become the alpha sheep trader you were born to be! 🐑🎓
          </p>
        </div>

        {!selectedCourse ? (
          <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="glass-card border-blue-500/20">
                <CardContent className="p-6 text-center">
                  <BookOpen className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-400">
                    {MOCK_COURSES.length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Courses
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-green-500/20">
                <CardContent className="p-6 text-center">
                  <Users className="h-8 w-8 text-green-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-400">
                    {MOCK_COURSES.reduce(
                      (sum, course) => sum + course.enrolled,
                      0,
                    ).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Students Enrolled
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-purple-500/20">
                <CardContent className="p-6 text-center">
                  <Award className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-400">
                    {MOCK_COURSES.filter((c) => c.completed).length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Completed by You
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-gold-500/20">
                <CardContent className="p-6 text-center">
                  <GraduationCap className="h-8 w-8 text-gold-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gold-400">
                    {Math.round(
                      MOCK_COURSES.reduce(
                        (sum, course) => sum + course.progress,
                        0,
                      ) / MOCK_COURSES.length,
                    )}
                    %
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Average Progress
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={
                    selectedCategory === category ? "default" : "outline"
                  }
                  onClick={() => setSelectedCategory(category)}
                  className={
                    selectedCategory === category
                      ? "bg-blue-500 hover:bg-blue-600"
                      : "border-blue-500/50 text-blue-400 hover:bg-blue-500/20"
                  }
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <Card
                  key={course.id}
                  className="glass-card border-purple-500/20 hover:border-purple-500/40 transition-all cursor-pointer hover:scale-105"
                  onClick={() => setSelectedCourse(course)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-4xl">{course.thumbnail}</div>
                      <Badge className={getLevelColor(course.level)}>
                        {course.level}
                      </Badge>
                    </div>
                    <CardTitle className="text-purple-400 text-lg">
                      {course.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {course.description}
                    </p>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {course.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          {course.lessons} lessons
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {course.enrolled.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-400" />
                          {course.rating}
                        </div>
                      </div>

                      {course.progress > 0 && (
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} className="h-2" />
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {course.category}
                        </Badge>
                        {course.completed && (
                          <CheckCircle className="h-5 w-5 text-green-400" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          /* Course Detail View */
          <div className="space-y-8">
            <div className="flex items-center gap-4 mb-6">
              <Button
                onClick={() => setSelectedCourse(null)}
                variant="outline"
                className="border-blue-500/50 text-blue-400 hover:bg-blue-500/20"
              >
                ← Back to Courses
              </Button>
              <div className="text-4xl">{selectedCourse.thumbnail}</div>
              <div>
                <h2 className="text-2xl font-bold text-purple-400">
                  {selectedCourse.title}
                </h2>
                <p className="text-muted-foreground">
                  {selectedCourse.description}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Course Info */}
              <div className="lg:col-span-2">
                <Card className="glass-card border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="text-purple-400">
                      📚 Course Lessons
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {MOCK_LESSONS.map((lesson, index) => (
                        <div
                          key={lesson.id}
                          className={`p-4 rounded-lg border transition-all ${
                            lesson.completed
                              ? "bg-green-500/10 border-green-500/20"
                              : lesson.locked
                                ? "bg-gray-500/10 border-gray-500/20 opacity-50"
                                : "bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20 cursor-pointer"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0">
                              {lesson.completed ? (
                                <CheckCircle className="h-5 w-5 text-green-400" />
                              ) : lesson.locked ? (
                                <Lock className="h-5 w-5 text-gray-400" />
                              ) : (
                                <Play className="h-5 w-5 text-blue-400" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold">
                                {index + 1}. {lesson.title}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {lesson.duration}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Course Sidebar */}
              <div className="space-y-6">
                <Card className="glass-card border-gold-500/20">
                  <CardHeader>
                    <CardTitle className="text-gold-400">
                      📊 Course Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration</span>
                      <span className="font-semibold">
                        {selectedCourse.duration}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Lessons</span>
                      <span className="font-semibold">
                        {selectedCourse.lessons}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Level</span>
                      <Badge className={getLevelColor(selectedCourse.level)}>
                        {selectedCourse.level}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Rating</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400" />
                        <span className="font-semibold">
                          {selectedCourse.rating}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Students</span>
                      <span className="font-semibold">
                        {selectedCourse.enrolled.toLocaleString()}
                      </span>
                    </div>

                    {selectedCourse.progress > 0 && (
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Your Progress</span>
                          <span>{selectedCourse.progress}%</span>
                        </div>
                        <Progress
                          value={selectedCourse.progress}
                          className="h-3"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="glass-card border-green-500/20">
                  <CardHeader>
                    <CardTitle className="text-green-400">
                      🎯 What You'll Learn
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />
                        Master the fundamentals of DeFi
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />
                        Avoid common trading mistakes
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />
                        Develop a winning strategy
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />
                        Build confidence in trading
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
