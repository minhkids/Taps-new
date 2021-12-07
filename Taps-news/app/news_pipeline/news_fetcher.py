# -*- coding: utf-8 -*-
import sys
sys.path.append('./')
from common.queue_client import QueueClient
from task_queue_name import DEDUPE_NEWS_TASK_QUEUE_NAME,SCRAPE_NEWS_TASK_QUEUE_NAME
# import common package in parent directory



SLEEP_TIME_IN_SECONDS = 1

dedupe_news_queue_client = QueueClient(DEDUPE_NEWS_TASK_QUEUE_NAME)
scrape_news_queue_client = QueueClient(SCRAPE_NEWS_TASK_QUEUE_NAME)


def handle_message(msg):
    if not isinstance(msg, dict):
        print('message is broken')
        return

    dedupe_news_queue_client.sendMessage(msg)


while True:
    # Fetch msg from queue_name
    if scrape_news_queue_client is not None:
        msg = scrape_news_queue_client.getMessage()
        if msg is not None:
            # Handle message
            try:
                handle_message(msg)
            except Exception as e:
                print('===============================================================')
                print('Exception fetcher')
                print(e)
                print('===============================================================')
        scrape_news_queue_client.sleep(SLEEP_TIME_IN_SECONDS)
