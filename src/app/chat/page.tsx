'use client';

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import { Message, MessageContent } from '@/components/ai-elements/message';
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputBody,
  PromptInputButton,
  type PromptInputMessage,
  PromptInputModelSelect,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from '@/components/ai-elements/prompt-input';
import {
  Actions,
  Action,
} from '@/components/ai-elements/actions';
import { DefaultChatTransport } from "ai";
import type { ChatMessage } from "@/app/api/tools/route";
import { Fragment, useEffect, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { Response } from '@/components/ai-elements/response';
import { CopyIcon, GlobeIcon, RefreshCcwIcon } from 'lucide-react';
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from '@/components/ai-elements/sources';
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from '@/components/ai-elements/reasoning';
import { Loader } from '@/components/ai-elements/loader';
import PropertyComponent from './property-component';
import { ChartAreaInteractive } from '@/components/ui/chart-area-interactive';
import { Button } from '@/components/ui/button';

const models = [
  {
    name: 'MasterKeyOS',
    value: 'openai/gpt-4o',
  }
];

export default function Chat(){
  const [input, setInput] = useState('');
  const [model, setModel] = useState<string>(models[0].value);
  const [webSearch, setWebSearch] = useState(false);

  const { messages, sendMessage, status, error, stop } = useChat<ChatMessage>({
    transport: new DefaultChatTransport({
      api: "/api/tools",
    }),
  });

  // Send initial greeting when chat loads
  useEffect(() => {
    if (messages.length === 0) {
      sendMessage({
        text: "Let's get started..."
      });
    }
  }, [messages.length, sendMessage]);

  function regenerate(): void {
    throw new Error('Function not implemented.');
  }

  const handleSubmit = (message: PromptInputMessage) => {
    const hasText = Boolean(message.text);
    const hasAttachments = Boolean(message.files?.length);

    if (!(hasText || hasAttachments)) {
      return;
    }

    sendMessage(
      { 
        text: message.text || 'Sent with attachments',
        files: message.files 
      },
      {
        body: {
          model: model,
          webSearch: webSearch,
        },
      },
    );
    setInput('');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 relative size-full h-screen">
      <div className="flex flex-col h-full">
        <Conversation className="h-full">
          <ConversationContent>
            {messages.map((message) => (
              <div key={message.id}>
                {message.role === 'assistant' && message.parts.filter((part) => part.type === 'source-url').length > 0 && (
                  <Sources>
                    <SourcesTrigger
                      count={
                        message.parts.filter(
                          (part) => part.type === 'source-url',
                        ).length
                      }
                    />
                    {message.parts.filter((part) => part.type === 'source-url').map((part, i) => (
                      <SourcesContent key={`${message.id}-${i}`}>
                        <Source
                          key={`${message.id}-${i}`}
                          href={part.url}
                          title={part.url}
                        />
                      </SourcesContent>
                    ))}
                  </Sources>
                )}
                {message.parts.map((part, i) => {
                  switch (part.type) {
                    case 'text':
                      return (
                        <Fragment key={`${message.id}-${i}`}>
                          <Message from={message.role}>
                            <MessageContent>
                              <Response>
                                {part.text}
                              </Response>
                            </MessageContent>
                          </Message>
                          
                          {/* Quick response buttons for specific questions */}
                          {message.role === 'assistant' && (
                            part.text.toLowerCase().includes('thanks for providing your address') 
                          ) && (
                            <div className="flex gap-2 mt-3">
                              <button 
                                onClick={() => sendMessage({ text: "I'm interested in selling my property" })}
                                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                              >
                                🏠 Selling
                              </button>
                              <button 
                                onClick={() => sendMessage({ text: "I'm just curious about market conditions" })}
                                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm"
                              >
                                📊 Just Curious
                              </button>
                            </div>
                          )}
                          {message.role === 'assistant' && (
                            part.text.toLowerCase().includes('timeframe for selling') 
                          ) && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              <button 
                                onClick={() => sendMessage({ text: "ASAP (within 30 days)" })}
                                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm"
                              >
                                🚀 ASAP (30 days)
                              </button>
                              <button 
                                onClick={() => sendMessage({ text: "Within 3 months" })}
                                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm"
                              >
                                📅 3 months
                              </button>
                              <button 
                                onClick={() => sendMessage({ text: "Within 6 months" })}
                                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors text-sm"
                              >
                                ⏰ 6 months
                              </button>
                              <button 
                                onClick={() => sendMessage({ text: "Within a year" })}
                                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm"
                              >
                                📆 1 year
                              </button>
                              <button 
                                onClick={() => sendMessage({ text: "Just exploring my options" })}
                                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                              >
                                🤔 Exploring
                              </button>
                            </div>
                          )}
                          {message.role === 'assistant' && (
                            part.text.toLowerCase().includes('condition of the property') 
                          ) && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              <button 
                                onClick={() => sendMessage({ text: "Excellent - Move-in ready (5 stars)" })}
                                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm"
                              >
                                ⭐⭐⭐⭐⭐ Excellent
                              </button>
                              <button 
                                onClick={() => sendMessage({ text: "Good - Minor updates needed (4 stars)" })}
                                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm"
                              >
                                ⭐⭐⭐⭐ Good
                              </button>
                              <button 
                                onClick={() => sendMessage({ text: "Fair - Some renovations required (3 stars)" })}
                                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm"
                              >
                                ⭐⭐⭐ Fair
                              </button>
                              <button 
                                onClick={() => sendMessage({ text: "Needs work - Major repairs needed (2 stars)" })}
                                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm"
                              >
                                ⭐⭐ Needs Work
                              </button>
                              <button 
                                onClick={() => sendMessage({ text: "Fixer-upper - Extensive renovation required (1 star)" })}
                                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm"
                              >
                                ⭐ Fixer-upper
                              </button>
                            </div>
                          )}
                          {message.role === 'assistant' && (
                            part.text.toLowerCase().includes('what is your pricing priority') 
                          ) && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              <button 
                                onClick={() => sendMessage({ text: "Maximum market value" })}
                                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm"
                              >
                                💰 Maximum Value
                              </button>
                              <button 
                                onClick={() => sendMessage({ text: "Quick sale, competitive price" })}
                                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm"
                              >
                                ⚡ Quick Sale
                              </button>
                              <button 
                                onClick={() => sendMessage({ text: "Not sure - need professional guidance" })}
                                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm"
                              >
                                🤔 Need Guidance
                              </button>
                              <button 
                                onClick={() => sendMessage({ text: "Have a specific price in mind" })}
                                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm"
                              >
                                🎯 Specific Price
                              </button>
                            </div>
                          )}
                          
                          {message.role === 'assistant' && i === message.parts.length - 1 && (
                            <Actions className="mt-2">
                              <Action
                                onClick={() => regenerate()}
                                label="Retry"
                              >
                                <RefreshCcwIcon className="size-3" />
                              </Action>
                              <Action
                                onClick={() =>
                                  navigator.clipboard.writeText(part.text)
                                }
                                label="Copy"
                              >
                                <CopyIcon className="size-3" />
                              </Action>
                            </Actions>
                          )}
                        </Fragment>
                      );
                    case "tool-getAddress":
                      switch (part.state) {
                        case "input-streaming":
                          return (
                            <div
                              key={`${message.id}-getAddress-${i}`}
                              className="bg-zinc-800/50 border border-zinc-700 p-2 rounded mt-1 mb-2"
                            >
                              <div className="text-sm text-zinc-500">
                                🏠 Gathering Address Details...
                              </div>
                        
                            </div>
                          );

                        case "input-available":
                          return (
                            <div
                              key={`${message.id}-getAddress-${i}`}
                              className="bg-zinc-800/50 border border-zinc-700 p-2 rounded mt-1 mb-2"
                            >
                              <div className="text-sm text-zinc-400">
                                🏠 Getting property data for {part.input.address}...
                              </div>
                            </div>
                          );

                        case "output-available":
                          return (
                            <div
                              key={`${message.id}-getAddress-${i}`}
                              className="mt-1 mb-2"
                            >
                              <div className="text-sm text-zinc-400">🏠 Property Data</div>
                              <div className="bg-gray-50 p-4 rounded-lg mt-2">
                                {/* <pre className="text-sm text-gray-700">
                                  {JSON.stringify(part.output, null, 2)}
                                </pre> */}
                                <PropertyComponent propertyData={part.output}/>
                              </div>
                            </div>
                          );

                        case "output-error":
                          return (
                            <div
                              key={`${message.id}-getAddress-${i}`}
                              className="bg-zinc-100 border block w-auto border-zinc-100 p-2 rounded-full mt-1 mb-2"
                            >
                              <div className="text-sm text-red-400">
                                Error: {part.errorText}
                              </div>
                            </div>
                          );

                        default:
                          return null;
                      }

                    case 'tool-getValueHistory':
                      switch (part.state) {
                        case 'input-streaming':
                          return (
                            <div
                              key={`${message.id}-getValueHistory-${i}`}
                              className="bg-zinc-800/50 border border-zinc-700 p-2 rounded mt-1 mb-2"
                            >
                              <div className="text-sm text-zinc-500">
                                📸 Gathering Property Details...
                              </div>
          
                            </div>
                          );

                        case 'input-available':
                          return (
                            <div
                              key={`${message.id}-getValueHistory-${i}`}
                              className="bg-zinc-800/50 border border-zinc-700 p-2 rounded mt-1 mb-2"
                            >
                              <div className="text-sm text-zinc-400">
                                📸 Getting property images for {part.input.address}...
                              </div>
                            </div>
                          );

                        case 'output-available':
                          console.log('getValueHistory output:', part.output)
                          console.log('getValueHistory output type:', typeof part.output)
                          console.log('getValueHistory output length:', part.output?.length)
                          return (
                            <div
                              key={`${message.id}-getValueHistory-${i}`}
                              className="mt-1 mb-2"
                            >
                              <div className="text-sm text-zinc-400">📸 Property Value History</div>
                              <div className="bg-gray-50 p-4 rounded-lg mt-2">
                                
                                <ChartAreaInteractive address={part.input.address} valueData={part.output}/>
                             
                              </div>
                            </div>
                          );

                        case 'output-error':
                          return (
                            <div
                              key={`${message.id}-getValueHistory-${i}`}
                              className="bg-zinc-100 border block w-auto border-zinc-100 p-2 rounded-full mt-1 mb-2"
                            >
                              <div className="text-sm text-red-400">
                                Error: {part.errorText}
                              </div>
                            </div>
                          );

                        default:
                          return null;
                      }

                    case 'tool-getAgentInfo':
                      switch (part.state) {
                        case 'input-streaming':
                          return (
                            <div
                              key={`${message.id}-getAgentInfo-${i}`}
                              className="bg-zinc-800/50 border border-zinc-700 p-2 rounded mt-1 mb-2"
                            >
                              <div className="text-sm text-zinc-500">
                                👤 Loading agent information...
                              </div>
                            </div>
                          );

                        case 'input-available':
                          return (
                            <div
                              key={`${message.id}-getAgentInfo-${i}`}
                              className="bg-zinc-800/50 border border-zinc-700 p-2 rounded mt-1 mb-2"
                            >
                              <div className="text-sm text-zinc-400">
                                👤 Getting agent contact information...
                              </div>
                            </div>
                          );

                        case 'output-available':
                          return (
                            <div
                              key={`${message.id}-getAgentInfo-${i}`}
                              className="mt-1 mb-2"
                            >
                              <div className="text-sm text-zinc-400">👤 Agent Contact Information</div>
                              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mt-2">
                                <div className="flex items-start space-x-4">
                                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="text-2xl">👤</span>
                                  </div>
                                  <div className="flex-1">
                                    <h3 className="font-semibold text-lg text-blue-900">{part.output.agent.name}</h3>
                                    <p className="text-blue-700 mb-2">{part.output.agent.title}</p>
                                    <div className="space-y-1 text-sm">
                                      <p><span className="font-medium">Phone:</span> {part.output.agent.phone}</p>
                                      <p><span className="font-medium">Email:</span> {part.output.agent.email}</p>
                                      <p><span className="font-medium">License:</span> {part.output.agent.license}</p>
                                      <p><span className="font-medium">Experience:</span> {part.output.agent.experience}</p>
                                      <p><span className="font-medium">Specialties:</span> {part.output.agent.specialties.join(", ")}</p>
                                    </div>
                                  </div>
                          
                                </div>
                                <Button className="mt-2">Get in touch</Button>
                              </div>
                            </div>
                          );

                        case 'output-error':
                          return (
                            <div
                              key={`${message.id}-getAgentInfo-${i}`}
                              className="bg-zinc-100 border block w-auto border-zinc-100 p-2 rounded-full mt-1 mb-2"
                            >
                              <div className="text-sm text-red-400">
                                Error: {part.errorText}
                              </div>
                            </div>
                          );

                        default:
                          return null;
                      }

                    case 'reasoning':
                      return (
                        <Reasoning
                          key={`${message.id}-${i}`}
                          className="w-full"
                          isStreaming={status === 'streaming' && i === message.parts.length - 1 && message.id === messages.at(-1)?.id}
                        >
                          <ReasoningTrigger />
                          <ReasoningContent>{part.text}</ReasoningContent>
                        </Reasoning>
                      );
                    default:
                      return null;
                  }
                })}
              </div>
            ))}
            {status === 'submitted' && <Loader />}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <PromptInput onSubmit={handleSubmit} className="mt-4" globalDrop multiple>
          <PromptInputBody>
            <PromptInputAttachments>
              {(attachment) => <PromptInputAttachment data={attachment} />}
            </PromptInputAttachments>
            <PromptInputTextarea
              onChange={(e) => setInput(e.target.value)}
              value={input}
            />
          </PromptInputBody>
          <PromptInputToolbar>
            <PromptInputTools>
              <PromptInputActionMenu>
                <PromptInputActionMenuTrigger />
                <PromptInputActionMenuContent>
                  <PromptInputActionAddAttachments />
                </PromptInputActionMenuContent>
              </PromptInputActionMenu>
              <PromptInputButton
                variant={webSearch ? 'default' : 'ghost'}
                onClick={() => setWebSearch(!webSearch)}
              >
                <GlobeIcon size={16} />
                <span>Search</span>
              </PromptInputButton>
              <PromptInputModelSelect
                onValueChange={(value) => {
                  setModel(value);
                }}
                value={model}
              >
                <PromptInputModelSelectTrigger>
                  <PromptInputModelSelectValue />
                </PromptInputModelSelectTrigger>
                <PromptInputModelSelectContent>
                  {models.map((model) => (
                    <PromptInputModelSelectItem key={model.value} value={model.value}>
                      {model.name}
                    </PromptInputModelSelectItem>
                  ))}
                </PromptInputModelSelectContent>
              </PromptInputModelSelect>
            </PromptInputTools>
            <PromptInputSubmit disabled={!input && !status} status={status} />
          </PromptInputToolbar>
        </PromptInput>
      </div>
    </div>
  );
};

