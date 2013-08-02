require 'httparty'

module TweetHelpers
  def tweet(id)
    data = HTTParty.get("https://api.twitter.com/1/statuses/oembed.json?id=#{id}&align=center")
    if data
      data.parsed_response['html']
    end
  end
end
