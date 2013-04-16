task :build do
  system 'middleman build'
end

task :sync do
  system 'middleman s3_sync'
end

task default: [:build, :sync]
