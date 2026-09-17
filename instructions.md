git clone https://github.com/AkashMushigeri/SkillSetu.git
cd SkillSetu

git checkout main
git pull origin main

git checkout -b feature/<your-feature-name>

# Add or modify your files/code

git status
git add .
git commit -m "Add <your-feature-name>"

git push -u origin feature/<your-feature-name>

# Then create a Pull Request on GitHub:
# feature/<your-feature-name> → main

# After the Pull Request is merged:
git checkout main
git pull origin main

# Delete your old local branch:
git branch -d feature/<your-feature-name>

# For your next feature:
git checkout main
git pull origin main
git checkout -b feature/<new-feature-name>
