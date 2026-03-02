<template>
  <UError
    :clear="{
      color: 'neutral',
      size: 'xl',
      icon: 'i-mdi-arrow-left',
      class: 'rounded-full',
    }"
    :error="{
      statusCode: 404,
      statusMessage: 'Page not found',
      message: 'The page you are looking for does not exist.',
    }"
  />
</template>
