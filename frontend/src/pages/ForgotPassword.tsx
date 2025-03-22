
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, Loader2 } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await forgotPassword(email);
      setIsSuccess(true);
    } catch (error) {
      // Error is handled in the auth context
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-secondary/30">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">PersonaChat</h1>
          <p className="text-muted-foreground mt-2">Discover your chat personality</p>
        </div>
        
        <Card className="glassmorphism shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Reset your password</CardTitle>
            <CardDescription>
              {isSuccess 
                ? "Check your email for a password reset link" 
                : "Enter your email to receive a password reset link"}
            </CardDescription>
          </CardHeader>
          
          {isSuccess ? (
            <CardContent className="space-y-6 flex flex-col items-center justify-center pt-4">
              <CheckCircle className="h-16 w-16 text-primary animate-fade-in" />
              <div className="text-center space-y-2">
                <h3 className="text-lg font-medium">Check your email</h3>
                <p className="text-muted-foreground">
                  We've sent a password reset link to <span className="font-medium">{email}</span>
                </p>
              </div>
              <Button asChild className="w-full mt-4">
                <Link to="/login">Back to login</Link>
              </Button>
            </CardContent>
          ) : (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="transition-all duration-200"
                  />
                </div>
              </CardContent>
              
              <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending link...
                    </>
                  ) : (
                    <>Send reset link</>
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

export default ForgotPassword;
