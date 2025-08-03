#!/bin/bash

# Read .gitignore file and store patterns in an array
read_gitignore_patterns() {
    if [ -f .gitignore ]; then
        while read -r pattern; do
            # Skip comments and empty lines
            if [[ "$pattern" =~ ^\s*# || -z "$pattern" ]]; then
                continue
            fi

            # Remove leading/trailing spaces and normalize patterns
            pattern=$(echo "$pattern" | sed 's/^\s*//;s/\s*$//')

            # Convert patterns to match full paths
            gitignore_patterns+=("$pattern")
        done < .gitignore
    fi
}

# Check if a file or directory matches any .gitignore pattern
matches_gitignore() {
    local path="$1"

    for pattern in "${gitignore_patterns[@]}"; do
        if [[ "$path" == $pattern || "$path" == ./"$pattern" || "$path" == "$pattern"/* || "$path" == ./"$pattern"/* ]]; then
            return 0
        fi
    done
    return 1
}

# Function to list files and their contents recursively, excluding .gitignore patterns
list_files() {
    local dir="$1"

    # Iterate over all files and directories in the current directory
    for entry in "$dir"/*; do
        if [ -d "$entry" ]; then
            if ! matches_gitignore "$entry"; then
                # Recursively call the function for directories
                list_files "$entry"
            fi
        elif [ -f "$entry" ]; then
            if ! matches_gitignore "$entry"; then
                echo
                echo "File: $entry"
                echo "Contents:"
                cat "$entry"
                echo
                echo "----------END------------"
                echo
            fi
        fi
    done
}

# Initialize gitignore patterns array
declare -a gitignore_patterns

# Read .gitignore patterns
read_gitignore_patterns

# Start listing files from the current directory
list_files "${1:-.}"