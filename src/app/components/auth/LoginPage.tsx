import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth, User } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Building2, Shield, Users, Wallet, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import svgPaths from '../../../imports/svg-jtx71fwlqz';

export function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const roles = [
    {
      value: 'admin',
      label: 'Admin',
      icon: Shield,
      description: 'Full system control & configuration',
      color: 'from-purple-500 to-indigo-600',
      borderColor: 'border-purple-400',
      bgSelected: 'bg-gradient-to-br from-purple-50 to-indigo-50',
    },
    {
      value: 'originator',
      label: 'Originator',
      icon: Users,
      description: 'Create & manage loan requests',
      color: 'from-blue-500 to-cyan-600',
      borderColor: 'border-blue-400',
      bgSelected: 'bg-gradient-to-br from-blue-50 to-cyan-50',
    },
    {
      value: 'supervisor',
      label: 'Supervisor',
      icon: Building2,
      description: 'Review & validate loan requests',
      color: 'from-green-500 to-emerald-600',
      borderColor: 'border-green-400',
      bgSelected: 'bg-gradient-to-br from-green-50 to-emerald-50',
    },
    {
      value: 'funder',
      label: 'Funder',
      icon: Wallet,
      description: 'Final approval & capital management',
      color: 'from-amber-500 to-orange-600',
      borderColor: 'border-amber-400',
      bgSelected: 'bg-gradient-to-br from-amber-50 to-orange-50',
    },
  ];

  const handleLogin = () => {
    if (!selectedRole || !name || !email) return;

    let companyId: string | undefined;
    let companyName: string | undefined;

    switch (selectedRole) {
      case 'admin':
        companyId = undefined;
        companyName = undefined;
        break;
      case 'originator':
        companyId = 'c2';
        companyName = 'Premier Lending Inc';
        break;
      case 'supervisor':
        companyId = 'c3';
        companyName = 'Trust Validation Services';
        break;
      case 'funder':
        companyId = 'c1';
        companyName = 'Global Capital Fund';
        break;
    }

    const user: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      role: selectedRole as User['role'],
      companyId,
      companyName,
    };

    login(user);

    switch (selectedRole) {
      case 'admin':
        navigate('/admin');
        break;
      case 'originator':
        navigate('/originator');
        break;
      case 'supervisor':
        navigate('/supervisor');
        break;
      case 'funder':
        navigate('/funder');
        break;
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/40 flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Logo Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-6 text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          {/* Logo Icon */}
          <motion.div 
            initial={{ rotate: -10, scale: 0.8 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="w-12 h-12 relative flex-shrink-0"
          >
            <svg className="absolute inset-0 w-full h-full drop-shadow-lg" fill="none" preserveAspectRatio="xMidYMid meet" viewBox="0 0 267 334">
              <path d={svgPaths.p3a5d0000} fill="url(#paint0_linear)" />
              <defs>
                <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear" x1="-35.16" x2="334.39" y1="169.65" y2="168.48">
                  <stop stopColor="#9717F7" />
                  <stop offset="1" stopColor="#5239F3" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
          {/* Logo Text */}
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl font-bold drop-shadow-sm"
            style={{
              fontFamily: "'Ubuntu', sans-serif",
              backgroundImage: "linear-gradient(89.627deg, rgb(151, 23, 247) 12.934%, rgb(82, 57, 243) 125.05%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "-0.05em"
            }}
          >
            fiona.
          </motion.h1>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h2 className="text-lg font-bold text-slate-800 mb-1.5 tracking-tight">
            Next-Generation Loan Management Platform
          </h2>
          <div className="flex items-center justify-center gap-2 text-slate-600">
            <div className="h-px w-10 bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
            <p className="text-xs font-medium">
              Streamlined Workflows • Intelligent Automation • Secure Documents
            </p>
            <div className="h-px w-10 bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
          </div>
        </motion.div>
      </motion.div>

      {/* Main Content - SIDE BY SIDE Layout */}
      <div className="flex gap-6 items-center justify-center w-full max-w-[1000px]">
        {/* LEFT SIDE: Role Selection */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="w-[420px] flex-shrink-0"
        >
          <div className="mb-4">
            <h3 className="text-xl font-bold text-slate-800 mb-0.5">Select Your Role</h3>
            <p className="text-xs text-slate-600">Choose your access level</p>
          </div>
          
          <div className="space-y-2.5">
            {roles.map((role, index) => {
              const Icon = role.icon;
              const isSelected = selectedRole === role.value;
              return (
                <motion.div
                  key={role.value}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <Card
                    className={`cursor-pointer transition-all duration-300 ${
                      isSelected
                        ? `ring-3 ring-purple-500/40 shadow-xl ${role.borderColor} ${role.bgSelected}`
                        : 'border-2 border-slate-200 hover:border-purple-300 hover:shadow-lg bg-white'
                    }`}
                    onClick={() => setSelectedRole(role.value)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        {/* Icon */}
                        <div
                          className={`w-10 h-10 rounded-lg bg-gradient-to-br ${role.color} flex items-center justify-center shadow-lg flex-shrink-0 transition-transform duration-300 ${
                            isSelected ? 'scale-110' : ''
                          }`}
                        >
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-base font-bold text-slate-800">
                            {role.label}
                          </h4>
                          <p className="text-[11px] text-slate-600">
                            {role.description}
                          </p>
                        </div>

                        {/* Selection Indicator */}
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex-shrink-0"
                          >
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                              <CheckCircle2 className="w-4 h-4 text-white" />
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* RIGHT SIDE: Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="w-[400px] flex-shrink-0"
        >
          <Card className="shadow-2xl border-2 border-slate-200 bg-white overflow-hidden">
            <CardHeader className="text-center pb-4 bg-gradient-to-br from-slate-50 via-white to-purple-50/30 border-b">
              {selectedRole ? (
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-2.5"
                >
                  {(() => {
                    const role = roles.find((r) => r.value === selectedRole);
                    if (role) {
                      const Icon = role.icon;
                      return (
                        <>
                          <div className="flex justify-center">
                            <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${role.color} flex items-center justify-center shadow-xl`}>
                              <Icon className="w-7 h-7 text-white" />
                            </div>
                          </div>
                          <div>
                            <CardTitle className="text-lg mb-0.5 text-slate-800 font-bold">
                              {role.label} Access
                            </CardTitle>
                            <CardDescription className="text-xs">
                              Enter your credentials to continue
                            </CardDescription>
                          </div>
                        </>
                      );
                    }
                    return null;
                  })()}
                </motion.div>
              ) : (
                <div className="py-3">
                  <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center mx-auto mb-2.5">
                    <Shield className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-lg mb-0.5 text-slate-800 font-bold">
                    Welcome Back
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Select a role to continue
                  </CardDescription>
                </div>
              )}
            </CardHeader>
            
            <CardContent className="p-5">
              {selectedRole ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="space-y-4"
                >
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-xs font-semibold text-slate-700">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-10 text-sm border-2 focus:ring-2 focus:ring-purple-500/20"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-semibold text-slate-700">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-10 text-sm border-2 focus:ring-2 focus:ring-purple-500/20"
                    />
                  </div>
                  
                  <Button
                    onClick={handleLogin}
                    disabled={!name || !email}
                    className={`w-full bg-gradient-to-r ${
                      roles.find((r) => r.value === selectedRole)?.color
                    } hover:opacity-90 text-white shadow-lg hover:shadow-xl gap-2 h-10 text-sm font-semibold transition-all duration-300`}
                  >
                    Continue to Dashboard
                    <ArrowRight className="w-4 h-4" />
                  </Button>

                  <div className="pt-2.5 border-t flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                    <span className="text-[11px] text-slate-600 font-medium">
                      Enterprise-grade security enabled
                    </span>
                  </div>
                </motion.div>
              ) : (
                <div className="py-14 text-center">
                  <Shield className="w-10 h-10 mx-auto mb-2.5 text-slate-300" />
                  <p className="text-xs text-slate-500">
                    Please select a role to continue
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center mt-6"
      >
        <p className="text-xs text-slate-400">
          SOC 2 Compliant • 256-bit Encryption • Multi-Factor Authentication
        </p>
      </motion.div>
    </div>
  );
}