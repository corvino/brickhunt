#! /usr/bin/env bash

dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

rm Brickhunt.sqlite
rm ~/Library/"Application Support"/brickhunt/brickhunt.sqlite

"${dir}/LoadSchema.ts"
"${dir}/LoadColors.ts"
"${dir}/LoadParts.ts"
