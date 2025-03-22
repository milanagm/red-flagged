
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, ArrowLeft, CheckCircle, Loader2 } from "lucide-react";

const ResetPassword = () => {
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isTokenInvalid, setIsTokenInvalid] = useState(false);
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Extract token from URL query parameters
    const searchParams = new URLSearchParams(location.search);
    const tokenParam = searchParams.get("token");
    
    if (!tokenParam) {
      setIsTokenInvalid(true);
    } else {
      setToken(tokenParam);
    }
  }, [location]);

  const validatePassword = () => {
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return false;
    }
    
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return false;
    }
    
    setPasswordError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      setIsTokenInvalid(true);
      return;
    }
    
    if (!validatePassword()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await resetPassword(token, password);
      setIsSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      // Error is handled in the auth context
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isTokenInvalid) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-secondary/30">
        <div className="w-full max-w-md animate-fade-in">
          <Card className="glassmorphism shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-destructive flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5" />
                Invalid Reset Link
              </CardTitle>
              <CardDescription>
                The password reset link is invalid or has expired.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Please request a new password reset link.
              </p>
              <div className="flex justify-center space-x-4">
                <Button asChild variant="outline">
                  <Link to="/login">Back to login</Link>
                </Button>
                <Button asChild>
                  <Link to="/forgot-password">Request new link</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-secondary/30">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Get Red Flagged!</h1>
        </div>
        
        <Card className="glassmorphism shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Set new password</CardTitle>
            <CardDescription>
              {isSuccess 
                ? "Your password has been reset successfully" 
                : "Create a new password for your account"}
            </CardDescription>
          </CardHeader>
          
          {isSuccess ? (
            <CardContent className="space-y-6 flex flex-col items-center justify-center pt-4">
              <CheckCircle className="h-16 w-16 text-primary animate-fade-in" />
              <div className="text-center space-y-2">
                <h3 className="text-lg font-medium">Password updated!</h3>
                <p className="text-muted-foreground">
                  You can now sign in with your new password.
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                Redirecting to login page...
              </p>
            </CardContent>
          ) : (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="transition-all duration-200"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="transition-all duration-200"
                  />
                  {passwordError && (
                    <p className="text-sm text-destructive mt-1">{passwordError}</p>
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating password...
                    </>
                  ) : (
                    <>Reset password</>
                  )}
                </Button>
                
                <div className="text-sm text-center text-muted-foreground">
                  <Link 
                    to="/login" 
                    className="text-primary hover:underline underline-offset-4 transition-all font-medium inline-flex items-center"
                  >
                    <ArrowLeft className="mr-1 h-3 w-3" /> Back to sign in
                  </Link>
                </div>
              </CardFooter>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
