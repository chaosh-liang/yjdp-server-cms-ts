#!/bin/bash
npm run build && pm2 start ../ecosystem.config.js
