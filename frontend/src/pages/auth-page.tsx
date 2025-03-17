import { Card, CardContent } from "../components/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/tabs";
import { Input } from "../components/input";
import { Button } from "../components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/form";
import { useAuth } from "../hooks/use-auth";
import { useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { insertUserSchema } from "../shared/schema";
import { Loader2 } from "lucide-react";

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [_, setLocation] = useLocation();

  // Redirect if already logged in
  if (user) {
    setLocation("/");
    return null;
  }

  const isLoading = loginMutation.isPending || registerMutation.isPending;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 relative">
      {isLoading && (
        <div className="loading-overlay">
          <div className="lds-roller">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      )}

      <img
        src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkwMiIgaGVpZ2h0PSIzNzUiIHZpZXdCb3g9IjAgMCAxOTAyIDM3NSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE3MS41NTcgMTUuODUxNUMyMTUuOTE3IDE1Ljg1MTUgMjU2LjM0MyAzMi42ODgxIDI4Ni43OTggNjAuMzE5MkwyMDcuNTU1IDk2Ljg5MThDMjAwLjc5NCAxMDAuMDEyIDE5My40MzQgMTAxLjYyOCAxODUuOTg3IDEwMS42MjhIMTAyLjkzNEM5My40NTkzIDEwMS42MjggODUuNzc4NyAxMDkuMzA5IDg1Ljc3ODcgMTE4Ljc4NFYyNTYuMDNDODUuNzc4NyAyNjUuNTA1IDkzLjQ1OTMgMjczLjE4NiAxMDIuOTM0IDI3My4xODZIMjQwLjE4QzI0OS42NTUgMjczLjE4NiAyNTcuMzM2IDI2NS41MDUgMjU3LjMzNiAyNTYuMDNDMjU3LjMzNiAyNTYuMDMgMjU3LjMzNiAxODAuNDI1IDI1Ny4zMzYgMTcyLjk3N0MyNTcuMzM2IDE2NS41MyAyNTguOTUyIDE1OC4xNzIgMjYyLjA3MyAxNTEuNDA5TDI5OC42NDcgNzIuMTcwM0MzMjYuMjc4IDEwMi42MjMgMzQzLjExNSAxNDMuMDQ5IDM0My4xMTUgMTg3LjQwOUMzNDMuMTE1IDI4Mi4xNTggMjY2LjMwNyAzNTguOTY2IDE3MS41NTcgMzU4Ljk2NkM3Ni44MDggMzU4Ljk2NiAtNy42MjkzOWUtMDYgMjgyLjE1OCAtNy42MjkzOWUtMDYgMTg3LjQwOUMtNy42MjkzOWUtMDYgOTIuNjU5NCA3Ni44MDggMTUuODUxNSAxNzEuNTU3IDE1Ljg1MTVaIiBmaWxsPSJ1cmwoI3BhaW50MF9saW5lYXJfMl8xMTc2MikiLz4KPHBhdGggZD0iTTU0MC40MDQgMjk2LjQwOVYxODkuMDI1SDQzOS4zODJWMjk2LjQwOUg0MDYuNDU2VjQ3LjU5MzJINDM5LjM4MlYxNTUuMzUxSDU0MC40MDRWNDcuNTkzMkg1NzIuOTU2VjI5Ni40MDlINTQwLjQwNFpNNzAxLjI2NCAyOTguMjhDNjg4LjU0MiAyOTguMjggNjc2LjQ0NCAyOTUuNzg1IDY2NC45NyAyOTAuNzk2QzY1My40OTYgMjg1LjgwOCA2NDMuMzk0IDI3OC45NDggNjM0LjY2MyAyNzAuMjE4QzYyNS45MzMgMjYxLjQ4NyA2MTkuMDczIDI1MS4zODUgNjE0LjA4NSAyMzkuOTExQzYwOS4wOTYgMjI4LjQzNyA2MDYuNjAxIDIxNi4zMzkgNjA2LjYwMSAyMDMuNjE3QzYwNi42MDEgMTkwLjY0NyA2MDkuMDk2IDE3OC4yOTkgNjE0LjA4NSAxNjYuNTc2QzYxOS4wNzMgMTU0Ljg1MiA2MjUuOTMzIDE0NC42MjUgNjM0LjY2MyAxMzUuODk1QzY0My4zOTQgMTI3LjE2NCA2NTMuNDk2IDEyMC40MjkgNjY0Ljk3IDExNS42OUM2NzYuNDQ0IDExMC43MDEgNjg4LjU0MiAxMDguMjA3IDcwMS4yNjQgMTA4LjIwN0M3MTQuMjM0IDEwOC4yMDcgNzI2LjU4MiAxMTAuNzAxIDczOC4zMDUgMTE1LjY5Qzc1MC4wMjkgMTIwLjQyOSA3NjAuMjU2IDEyNy4xNjQgNzY4Ljk4NiAxMzUuODk1Qzc3Ny43MTcgMTQ0LjYyNSA3ODQuNDUyIDE1NC44NTIgNzg5LjE5MSAxNjYuNTc2Qzc5NC4xOCAxNzguMjk5IDc5Ni42NzQgMTkwLjY0NyA3OTYuNjc0IDIwMy42MTdDNzk2LjY3NCAyMTYuMzM5IDc5NC4xOCAyMjguNDM3IDc4OS4xOTEgMjM5LjkxMUM3ODQuNDUyIDI1MS4zODUgNzc3LjcxNyAyNjEuNDg3IDc2OC45ODYgMjcwLjIxOEM3NjAuMjU2IDI3OC45NDggNzUwLjAyOSAyODUuODA4IDczOC4zMDUgMjkwLjc5NkM3MjYuNTgyIDI5NS43ODUgNzE0LjIzNCAyOTguMjggNzAxLjI2NCAyOTguMjhaTTcwMS4yNjQgMTQxLjUwN0M2ODQuNTUxIDE0MS41MDcgNjcwLjIwOCAxNDcuNDk0IDY1OC4yMzUgMTU5LjQ2N0M2NTIuNDk4IDE2NS4yMDQgNjQ4LjAwOCAxNzEuOTM5IDY0NC43NjYgMTc5LjY3MUM2NDEuNTIzIDE4Ny40MDQgNjM5LjkwMiAxOTUuMzg2IDYzOS45MDIgMjAzLjYxN0M2MzkuOTAyIDIxMS44NDkgNjQxLjUyMyAyMTkuNzA2IDY0NC43NjYgMjI3LjE4OUM2NDguMDA4IDIzNC42NzMgNjUyLjQ5OCAyNDEuMjgzIDY1OC4yMzUgMjQ3LjAyQzY2My45NzIgMjUyLjc1NyA2NzAuNDU4IDI1Ny4yNDcgNjc3LjY5MiAyNjAuNDlDNjg1LjE3NSAyNjMuNzMyIDY5My4wMzIgMjY1LjM1NCA3MDEuMjY0IDI2NS4zNTRDNzA5LjQ5NSAyNjUuMzU0IDcxNy40NzcgMjYzLjczMiA3MjUuMjEgMjYwLjQ5QzczMi45NDIgMjU3LjI0NyA3MzkuNTUzIDI1Mi43NTcgNzQ1LjA0IDI0Ny4wMkM3NTAuNTI4IDI0MS4yODMgNzU0Ljg5MyAyMzQuNjczIDc1OC4xMzYgMjI3LjE4OUM3NjEuMzc4IDIxOS43MDYgNzYzIDIxMS44NDkgNzYzIDIwMy42MTdDNzYzIDE5NS4zODYgNzYxLjM3OCAxODcuNDA0IDc1OC4xMzYgMTc5LjY3MUM3NTQuODkzIDE3MS45MzkgNzUwLjUyOCAxNjUuMjA0IDc0NS4wNCAxNTkuNDY3QzczOS41NTMgMTUzLjczIDczMi45NDIgMTQ5LjM2NCA3MjUuMjEgMTQ2LjM3MUM3MTcuNzI3IDE0My4xMjggNzA5Ljc0NSAxNDEuNTA3IDcwMS4yNjQgMTQxLjUwN1pNOTQyLjU1NSAyOTUuMjg2VjI3OS41NzJDOTM3LjU2NiAyODQuODEgOTMxLjIwNiAyODkuMTc1IDkyMy40NzMgMjkyLjY2N0M5MTUuOTkgMjk2LjE1OSA5MDguNTA3IDI5Ny45MDYgOTAxLjAyNCAyOTcuOTA2Qzg5MS4wNDYgMjk3LjkwNiA4ODEuNDQzIDI5Ni4wMzUgODcyLjIxMyAyOTIuMjkzQzg2My4yMzMgMjg4LjMwMiA4NTUuMjUxIDI4Mi44MTQgODQ4LjI2NyAyNzUuODNDODQxLjUzMiAyNjguODQ2IDgzNi4xNjkgMjYwLjg2NCA4MzIuMTc4IDI1MS44ODRDODI4LjQzNyAyNDIuNjU1IDgyNi41NjYgMjMyLjkyNyA4MjYuNTY2IDIyMi43VjEwOS4zMjlIODU5LjQ5MlYyMjIuN0M4NTkuNDkyIDIzNC4xNzQgODYzLjYwOCAyNDQuMDI3IDg3MS44MzkgMjUyLjI1OEM4ODAuMDcxIDI2MC40OSA4ODkuNzk5IDI2NC42MDUgOTAxLjAyNCAyNjQuNjA1QzkwNi4yNjIgMjY0LjYwNSA5MTEuNSAyNjMuNDgzIDkxNi43MzggMjYxLjIzOEM5MjEuOTc2IDI1OC45OTMgOTI2LjQ2NiAyNTYgOTMwLjIwOCAyNTIuMjU4QzkzOC40MzkgMjQ0LjAyNyA5NDIuNTU1IDIzNC4xNzQgOTQyLjU1NSAyMjIuN1YxMDkuMzI5SDk3NS4xMDdWMjk1LjI4Nkg5NDIuNTU1Wk0xMTYyLjAxIDI5Ni40MDlWMjY3LjU5OUMxMTU0LjAzIDI3Ny4wNzcgMTE0NC41NSAyODQuNTYxIDExMzMuNTggMjkwLjA0OEMxMTIyLjg1IDI5NS41MzYgMTExMS42MyAyOTguMjggMTA5OS45IDI5OC4yOEMxMDg2LjY4IDI5OC4yOCAxMDc0LjM0IDI5NS45MSAxMDYyLjg2IDI5MS4xNzFDMTA1MS4zOSAyODYuMTgyIDEwNDEuNDEgMjc5LjE5OCAxMDMyLjkzIDI3MC4yMThDMTAyNC4yIDI2MS4yMzggMTAxNy4zNCAyNTEuMDExIDEwMTIuMzUgMjM5LjUzN0MxMDA3LjYxIDIyNy44MTMgMTAwNS4yNCAyMTUuNDY2IDEwMDUuMjQgMjAyLjQ5NUMxMDA1LjI0IDE4OS41MjQgMTAwNy42MSAxNzcuMzAyIDEwMTIuMzUgMTY1LjgyN0MxMDE3LjM0IDE1NC4xMDQgMTAyNC4yIDE0My43NTIgMTAzMi45MyAxMzQuNzcyQzEwNDEuNDEgMTI1Ljc5MiAxMDUxLjM5IDExOC45MzMgMTA2Mi44NiAxMTQuMTkzQzEwNzQuMzQgMTA5LjIwNSAxMDg2LjY4IDEwNi43MSAxMDk5LjkgMTA2LjcxQzExMTIuODcgMTA2LjcxIDExMjQuNiAxMDkuMzI5IDExMzUuMDcgMTE0LjU2OEMxMTQ1LjggMTE5LjgwNiAxMTU0Ljc4IDEyNy4wNCAxMTYyLjAxIDEzNi4yNjlWNDcuOTY3M0gxMTk0Ljk0VjI5Ni40MDlIMTE2Mi4wMVpNMTA5OS45IDE0MC43NTlDMTA5MS42NyAxNDAuNzU5IDEwODMuODEgMTQyLjM4IDEwNzYuMzMgMTQ1LjYyM0MxMDY4Ljg1IDE0OC42MTYgMTA2Mi4zNiAxNTIuOTgxIDEwNTYuODggMTU4LjcxOEMxMDUxLjM5IDE2NC40NTUgMTA0Ny4wMiAxNzEuMTkgMTA0My43OCAxNzguOTIzQzEwNDAuNTQgMTg2LjQwNiAxMDM4LjkyIDE5NC4yNjMgMTAzOC45MiAyMDIuNDk1QzEwMzguOTIgMjE5LjIwNyAxMDQ0LjkgMjMzLjggMTA1Ni44OCAyNDYuMjcyQzEwNjIuMzYgMjUyLjAwOSAxMDY4Ljg1IDI1Ni40OTkgMTA3Ni4zMyAyNTkuNzQxQzEwODMuODEgMjYyLjk4NCAxMDkxLjY3IDI2NC42MDUgMTA5OS45IDI2NC42MDVDMTEwOC4xNCAyNjQuNjA1IDExMTUuOTkgMjYyLjk4NCAxMTIzLjQ4IDI1OS43NDFDMTEzMS4yMSAyNTYuNDk5IDExMzcuODIgMjUyLjAwOSAxMTQzLjMxIDI0Ni4yNzJDMTE1NS4yOCAyMzMuOCAxMTYxLjI3IDIxOS4yMDcgMTE2MS4yNyAyMDIuNDk1QzExNjEuMjcgMTk0LjI2MyAxMTU5LjY0IDE4Ni40MDYgMTE1Ni40IDE3OC45MjNDMTE1My4xNiAxNzEuMTkgMTE0OC43OSAxNjQuNDU1IDExNDMuMzEgMTU4LjcxOEMxMTM3LjgyIDE1Mi45ODEgMTEzMS4yMSAxNDguNjE2IDExMjMuNDggMTQ1LjYyM0MxMTE1Ljk5IDE0Mi4zOCAxMTA4LjE0IDE0MC43NTkgMTA5OS45IDE0MC43NTlaTTEyNDkuNDUgODIuMzg5OUMxMjQ0LjcxIDgyLjM4OTkgMTI0MC41OSA4MC43Njg2IDEyMzcuMSA3Ny41MjU5QzEyMzMuODYgNzQuMDMzNyAxMjMyLjI0IDY5LjkxOCAxMjMyLjI0IDY1LjE3ODZDMTIzMi4yNCA2MC40MzkzIDEyMzMuODYgNTYuNDQ4MiAxMjM3LjEgNTMuMjA1NUMxMjQwLjU5IDQ5LjcxMzQgMTI0NC43MSA0Ny45NjczIDEyNDkuNDUgNDcuOTY3M0MxMjU0LjE5IDQ3Ljk2NzMgMTI1OC4xOCA0OS43MTM0IDEyNjEuNDIgNTMuMjA1NUMxMjY0LjkxIDU2LjQ0ODIgMTI2Ni42NiA2MC40MzkzIDEyNjYuNjYgNjUuMTc4NkMxMjY2LjY2IDY5LjkxOCAxMjY0LjkxIDc0LjAzMzcgMTI2MS40MiA3Ny41MjU5QzEyNTguMTggODAuNzY4NiAxMjU0LjE5IDgyLjM4OTkgMTI0OS40NSA4Mi4zODk5Wk0xMjM0LjExIDI5Ni40MDlWMTA5LjMyOUgxMjY1LjU0VjI5Ni40MDlIMTIzNC4xMVpNMTQxOS44MyAyOTYuNDA5VjE4NC4xNjFDMTQxOS44MyAxNzIuOTM2IDE0MTUuNzIgMTYzLjIwOCAxNDA3LjQ5IDE1NC45NzdDMTM5OS41IDE0Ni45OTUgMTM4OS43OCAxNDMuMDA0IDEzNzguMyAxNDMuMDA0QzEzNjcuMDggMTQzLjAwNCAxMzU3LjM1IDE0Ny4xMTkgMTM0OS4xMiAxNTUuMzUxQzEzNDUuMzggMTU5LjA5MyAxMzQyLjM4IDE2My41ODIgMTM0MC4xNCAxNjguODIxQzEzMzcuODkgMTczLjgwOSAxMzM2Ljc3IDE3OC45MjMgMTMzNi43NyAxODQuMTYxVjI5Ni40MDlIMTMwNC4yMlYxMTMuODE5SDEzMzYuNzdWMTI5LjE2QzEzNDEuNTEgMTIzLjQyMyAxMzQ3Ljc0IDExOC42ODMgMTM1NS40OCAxMTQuOTQyQzEzNjMuMjEgMTExLjIgMTM3MC44MiAxMDkuMzI5IDEzNzguMyAxMDkuMzI5QzEzODguMjggMTA5LjMyOSAxMzk3Ljc2IDExMS4zMjUgMTQwNi43NCAxMTUuMzE2QzE0MTUuOTcgMTE5LjA1OCAxNDI0LjA3IDEyNC40MiAxNDMxLjA2IDEzMS40MDVDMTQzNy43OSAxMzguMTQgMTQ0My4wMyAxNDYuMTIyIDE0NDYuNzcgMTU1LjM1MUMxNDUwLjc2IDE2NC4zMzEgMTQ1Mi43NiAxNzMuOTM0IDE0NTIuNzYgMTg0LjE2MVYyOTYuNDA5SDE0MTkuODNaTTE1MTguNzIgMjE3LjA4N0MxNTE4LjcyIDIyMy4wNzQgMTUyMC44NSAyMjkuMzEgMTUyNS4wOSAyMzUuNzk1QzE1MjkuNTggMjQyLjI4MSAxNTM0LjY5IDI0Ny43NjggMTU0MC40MyAyNTIuMjU4QzE1NTAuOSAyNjAuNDkgMTU2My4xMyAyNjQuNjA1IDE1NzcuMDkgMjY0LjYwNUMxNTk5LjI5IDI2NC42MDUgMTYxNy4zOCAyNTMuODc5IDE2MzEuMzUgMjMyLjQyOEwxNjU5Ljc4IDI0OS4yNjVDMTY1MC4wNSAyNjQuOTggMTYzOC4wOCAyNzcuMDc3IDE2MjMuODYgMjg1LjU1OEMxNjA5LjY1IDI5NC4wMzkgMTU5NC4wNiAyOTguMjggMTU3Ny4wOSAyOTguMjhDMTU2NC4zNyAyOTguMjggMTU1Mi4yNyAyOTUuOTEgMTU0MC44IDI5MS4xNzFDMTUyOS4zMyAyODYuMTgyIDE1MTkuMjIgMjc5LjMyMiAxNTEwLjQ5IDI3MC41OTJDMTUwMS43NiAyNjEuODYyIDE0OTQuOSAyNTEuNzU5IDE0ODkuOTEgMjQwLjI4NUMxNDg1LjE4IDIyOC44MTEgMTQ4Mi44MSAyMTYuNzEzIDE0ODIuODEgMjAzLjk5MkMxNDgyLjgxIDE5MS4yNyAxNDg1LjE4IDE3OS4xNzIgMTQ4OS45MSAxNjcuNjk4QzE0OTQuOSAxNTUuOTc1IDE1MDEuNzYgMTQ1Ljc0OCAxNTEwLjQ5IDEzNy4wMTdDMTUxOC45NyAxMjguMjg3IDE1MjguOTUgMTIxLjU1MiAxNTQwLjQzIDExNi44MTNDMTU1Mi4xNSAxMTIuMDczIDE1NjQuMzcgMTA5LjcwNCAxNTc3LjA5IDEwOS43MDRDMTU4OS44MiAxMDkuNzA0IDE2MDEuOTEgMTEyLjA3MyAxNjEzLjM5IDExNi44MTNDMTYyNS4xMSAxMjEuNTUyIDE2MzUuMjEgMTI4LjI4NyAxNjQzLjY5IDEzNy4wMTdDMTY2Mi4xNSAxNTUuOTc1IDE2NzEuMzggMTc3LjkyNSAxNjcxLjM4IDIwMi44NjlDMTY3MS4zOCAyMDcuMzU5IDE2NzEuMDEgMjEyLjA5OCAxNjcwLjI2IDIxNy4wODdIMTUxOC43MlpNMTU3Ny4wOSAxNDAuMzg1QzE1NjYuODcgMTQwLjM4NSAxNTU3LjI2IDE0Mi42MyAxNTQ4LjI4IDE0Ny4xMTlDMTUzOS4zIDE1MS42MDkgMTUzMi4wNyAxNTcuNTk2IDE1MjYuNTggMTY1LjA3OUMxNTIxLjM0IDE3Mi4zMTMgMTUxOC43MiAxODAuMDQ1IDE1MTguNzIgMTg4LjI3N0gxNjM1LjQ2QzE2MzUuNDYgMTgwLjA0NSAxNjMyLjcyIDE3Mi4zMTMgMTYyNy4yMyAxNjUuMDc5QzE2MjEuOTkgMTU3LjU5NiAxNjE0Ljg4IDE1MS42MDkgMTYwNS45IDE0Ny4xMTlDMTU5Ni45MiAxNDIuNjMgMTU4Ny4zMiAxNDAuMzg1IDE1NzcuMDkgMTQwLjM4NVpNMTczMy41NyAyMTcuMDg3QzE3MzMuNTcgMjIzLjA3NCAxNzM1LjY5IDIyOS4zMSAxNzM5LjkzIDIzNS43OTVDMTc0NC40MiAyNDIuMjgxIDE3NDkuNTQgMjQ3Ljc2OCAxNzU1LjI4IDI1Mi4yNThDMTc2NS43NSAyNjAuNDkgMTc3Ny45NyAyNjQuNjA1IDE3OTEuOTQgMjY0LjYwNUMxODE0LjE0IDI2NC42MDUgMTgzMi4yMyAyNTMuODc5IDE4NDYuMiAyMzIuNDI4TDE4NzQuNjMgMjQ5LjI2NUMxODY0LjkgMjY0Ljk4IDE4NTIuOTMgMjc3LjA3NyAxODM4LjcxIDI4NS41NThDMTgyNC40OSAyOTQuMDM5IDE4MDguOSAyOTguMjggMTc5MS45NCAyOTguMjhDMTc3OS4yMiAyOTguMjggMTc2Ny4xMiAyOTUuOTEgMTc1NS42NSAyOTEuMTcxQzE3NDQuMTggMjg2LjE4MiAxNzM0LjA3IDI3OS4zMjIgMTcyNS4zNCAyNzAuNTkyQzE3MTYuNjEgMjYxLjg2MiAxNzA5Ljc1IDI1MS43NTkgMTcwNC43NiAyNDAuMjg1QzE3MDAuMDIgMjI4LjgxMSAxNjk3LjY1IDIxNi43MTMgMTY5Ny42NSAyMDMuOTkyQzE2OTcuNjUgMTkxLjI3IDE3MDAuMDIgMTc5LjE3MiAxNzA0Ljc2IDE2Ny42OThDMTcwOS43NSAxNTUuOTc1IDE3MTYuNjEgMTQ1Ljc0OCAxNzI1LjM0IDEzNy4wMTdDMTczMy44MiAxMjguMjg3IDE3NDMuOCAxMjEuNTUyIDE3NTUuMjggMTE2LjgxM0MxNzY3IDExMi4wNzMgMTc3OS4yMiAxMDkuNzA0IDE3OTEuOTQgMTA5LjcwNEMxODA0LjY2IDEwOS43MDQgMTgxNi43NiAxMTIuMDczIDE4MjguMjQgMTE2LjgxM0MxODM5Ljk2IDEyMS41NTIgMTg1MC4wNiAxMjguMjg3IDE4NTguNTQgMTM3LjAxN0MxODc3IDE1NS45NzUgMTg4Ni4yMyAxNzcuOTI1IDE4ODYuMjMgMjAyLjg2OUMxODg2LjIzIDIwNy4zNTkgMTg4NS44NiAyMTIuMDk4IDE4ODUuMTEgMjE3LjA4N0gxNzMzLjU3Wk0xNzkxLjk0IDE0MC4zODVDMTc4MS43MiAxNDAuMzg1IDE3NzIuMTEgMTQyLjYzIDE3NjMuMTMgMTQ3LjExOUMxNzU0LjE1IDE1MS42MDkgMTc0Ni45MiAxNTcuNTk2IDE3NDEuNDMgMTY1LjA3OUMxNzM2LjE5IDE3Mi4zMTMgMTczMy41NyAxODAuMDQ1IDE3MzMuNTcgMTg4LjI3N0gxODUwLjMxQzE4NTAuMzEgMTgwLjA0NSAxODQ3LjU3IDE3Mi4zMTMgMTg0Mi4wOCAxNjUuMDc5QzE4MzYuODQgMTU3LjU5NiAxODI5LjczIDE1MS42MDkgMTgyMC43NSAxNDcuMTE5QzE4MTEuNzcgMTQyLjYzIDE4MDIuMTcgMTQwLjM4NSAxNzkxLjk0IDE0MC4zODVaIiBmaWxsPSIjQkU0REZGIi8+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MF9saW5lYXJfMl8xMTc2MiIgeDE9IjMwMS4wODMiIHkxPSI1Ny44ODMiIHgyPSI0NS40NjI3IiB5Mj0iMzEzLjUwNCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjREZDMUYwIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0JFNERGRiIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPgo="
        alt="Houdinee Logo"
        className="w-64 mb-11"
      />

      <Card className="w-full max-w-4xl relative overflow-hidden shadow-[0_4px_0_0_#BE4DFF] border border-[#BE4DFF]">
        <div className="absolute right-0 top-0 w-[370px] h-[436px] bg-[#E2C7FF]/44 rounded-r-lg" />
        <CardContent className="p-8 grid md:grid-cols-2 gap-8 relative">
          <div className="flex flex-col items-center">
            <AuthTabs
              onLogin={(credentials) => loginMutation.mutate(credentials)}
              onRegister={(data) => registerMutation.mutate(data)}
              isLoading={isLoading}
            />
          </div>

          <div className="hidden md:block flex flex-col justify-center">
            <h1 className="text-2xl mb-8 text-[#8D5AAB]">
              <span className="font-normal">Houdinee: Make your links </span>
              <span className="font-[var(--font-accent)]">disappear!</span>
            </h1>
            <ul className="space-y-4 text-[#8D5AAB]">
              <li className="flex items-center gap-2 font-semibold">
                <span className="text-[#BE4DFF]">✓</span>
                Advanced Link Protection
              </li>
              <li className="flex items-center gap-2 font-semibold">
                <span className="text-[#BE4DFF]">✓</span>
                Bot & Threat Protection
              </li>
              <li className="flex items-center gap-2 font-semibold">
                <span className="text-[#BE4DFF]">✓</span>
                Smart UTM Management
              </li>
              <li className="flex items-center gap-2 font-semibold">
                <span className="text-[#BE4DFF]">✓</span>
                Real-Time Analytics
              </li>
            </ul>
            <p className="mt-6 text-[#8D5AAB] font-light">
              Everything you need to safeguard your links, optimize campaigns,
              and outsmart the competition.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="mt-11 text-[#8D5AAB] text-sm text-center">
        Copyright © 2025 Houdinee
      </div>
    </div>
  );
}

function AuthTabs({
  onLogin,
  onRegister,
  isLoading,
}: {
  onLogin: (data: any) => void;
  onRegister: (data: any) => void;
  isLoading: boolean;
}) {
  const loginForm = useForm({
    defaultValues: { username: "", password: "" },
  });

  const registerForm = useForm({
    resolver: zodResolver(insertUserSchema),
    defaultValues: { username: "", password: "", email: "" },
  });

  return (
    <Tabs defaultValue="login" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger
          value="login"
          className="font-heading data-[state=active]:bg-[#CD77FF] data-[state=active]:text-white data-[state=inactive]:bg-[#F2E6FF] data-[state=inactive]:text-[#CD77FF]"
        >
          Login
        </TabsTrigger>
        <TabsTrigger
          value="register"
          className="font-heading data-[state=active]:bg-[#CD77FF] data-[state=active]:text-white data-[state=inactive]:bg-[#F2E6FF] data-[state=inactive]:text-[#CD77FF]"
        >
          Register
        </TabsTrigger>
      </TabsList>

      <TabsContent value="login">
        <Form {...loginForm}>
          <form
            onSubmit={loginForm.handleSubmit(onLogin)}
            className="space-y-4"
          >
            <FormField
              control={loginForm.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#8D5AAB]">Username</FormLabel>
                  <FormControl>
                    <Input placeholder="john@doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={loginForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#8D5AAB]">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••••••••••"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full font-heading"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="animate-spin" /> : "Enter →"}
            </Button>
          </form>
        </Form>
      </TabsContent>

      <TabsContent value="register">
        <Form {...registerForm}>
          <form
            onSubmit={registerForm.handleSubmit(onRegister)}
            className="space-y-4"
          >
            <FormField
              control={registerForm.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#8D5AAB]">Username</FormLabel>
                  <FormControl>
                    <Input placeholder="john@doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={registerForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#8D5AAB]">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={registerForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#8D5AAB]">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••••••••••"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full font-heading"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="animate-spin" /> : "Register →"}
            </Button>
          </form>
        </Form>
      </TabsContent>
    </Tabs>
  );
}
