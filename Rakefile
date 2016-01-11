task :build do
  puts "Using #{ENV['LANG']} encoding..."
  system 'middleman build --clean'
end

task :sync do
  system 'middleman s3_sync'
end

task :invalidate do
  system 'middleman invalidate'
end

task default: [:build, :sync]
