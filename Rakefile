# frozen_string_literal: true

task :build do
  puts "Using #{ENV['LANG']} encoding..."
  system 'middleman build --clean'
end

task :sync do
  system 'middleman s3_sync'
end

task default: %i[build sync]
