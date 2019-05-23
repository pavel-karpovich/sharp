workflow "Deploy to GH-Pages" {
  on = "push"
  resolves = ["GitHub Pages Deploy"]
}

action "GitHub Pages Deploy" {
  uses = "maxheld83/ghpages@v0.2.0"
  secrets = [
    "GH_PAT",
  ]
  env = {
    BUILD_DIR = "dist/"
  }
}
