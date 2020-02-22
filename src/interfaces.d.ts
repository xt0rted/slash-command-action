export type PermissionLevel =
  | "admin"
  | "write"
  | "read"
  | "none";

export interface CommentEvent {
  author_association:string;
  body: string;
  created_at:string;
  html_url:string;
  id: number;
  issue_url:string;
  node_id:string;
  updated_a?:string;
  url:string;
}
