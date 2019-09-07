workflow "CI" {
  on = "push"
  resolves = ["Slash Commands"]
}

action "Slash Commands" {
  uses = "./"
}
