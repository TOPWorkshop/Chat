import $ from 'jquery';

import handleChat from './room';

$(() => {
  const $chat = $('.chat');

  if ($chat.length > 0) {
    const roomId = $chat.data('roomId');

    handleChat($chat, roomId);
  }
});
