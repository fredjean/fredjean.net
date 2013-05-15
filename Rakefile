task :build do
  puts "Using #{ENV['LANG']} encoding..."
  system 'middleman build'
end

task :sync do
  system 'middleman s3_sync'
end

task default: [:build, :sync]
