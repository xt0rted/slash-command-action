export type PermissionLevel = "admin" | "write" | "read" | "none";

export interface User {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
}

export interface CollaboratorPermissionLevel {
  permission: PermissionLevel;
  user: User;
}

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
  user: User;
}
