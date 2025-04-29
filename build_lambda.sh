#!/bin/bash
set -e

LAMBDA_SRC="lambdas/$1"
DIST="dist"
ZIP="$DIST/lambda.zip"

mkdir -p $DIST
rm -f $ZIP

echo "Packaging Lambda..."
cd $LAMBDA_SRC
pnpm build
cd ../..

echo "Lambda zipped at $ZIP"