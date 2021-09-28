#! /usr/bin/env bash

dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

"${dir}/LoadSchema.ts"
"${dir}/LoadColors.ts"
"${dir}/LoadParts.ts"
