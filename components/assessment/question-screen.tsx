"use client"

import { CheckboxGroup, CheckboxOption } from "@/components/ui/checkbox-group"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioOption } from "@/components/ui/radio-group"
import { RankList } from "@/components/ui/rank-list"
import { ScaleInput } from "@/components/ui/scale-input"
import { Textarea } from "@/components/ui/textarea"
import { isAnswered } from "@/lib/assessment/flow"
import type { AnswerValue, Answers, Question, Screen } from "@/lib/assessment/types"
import type { ReactElement } from "react"

export const QuestionScreen = ({ screen, answers, onAnswer, showErrors }: Props) => (
  <div className="flex flex-col gap-8">
    {screen.map((question) => {
      const showError = showErrors && !isAnswered(question, answers)
      const descriptionId = question.helper ? `${question.id}-description` : undefined
      const errorId = showError ? `${question.id}-error` : undefined
      const describedBy = [descriptionId, errorId].filter(Boolean).join(" ") || undefined

      return (
        <Field key={question.id}>
          <FieldLabel htmlFor={question.type === "text" ? question.id : undefined}>
            {question.prompt}
          </FieldLabel>
          {question.helper && (
            <FieldDescription id={descriptionId}>{question.helper}</FieldDescription>
          )}

          <QuestionControl
            question={question}
            answers={answers}
            onAnswer={onAnswer}
            describedBy={describedBy}
          />

          {showError && (
            <FieldError id={errorId} match>
              Please answer this to continue.
            </FieldError>
          )}
        </Field>
      )
    })}
  </div>
)

const QuestionControl = ({ question, answers, onAnswer, describedBy }: ControlProps): ReactElement => {
  const value = answers[question.id]

  switch (question.type) {
    case "text":
      return question.multiline ? (
        <Textarea
          id={question.id}
          aria-describedby={describedBy}
          value={typeof value === "string" ? value : ""}
          placeholder={question.placeholder}
          onChange={(event) => onAnswer(question.id, event.target.value)}
        />
      ) : (
        <Input
          id={question.id}
          aria-describedby={describedBy}
          value={typeof value === "string" ? value : ""}
          placeholder={question.placeholder}
          onChange={(event) => onAnswer(question.id, event.target.value)}
        />
      )

    case "choice":
      return (
        <RadioGroup
          value={typeof value === "string" ? value : null}
          onValueChange={(next) => onAnswer(question.id, String(next))}
        >
          {question.options.map((option) => (
            <RadioOption key={option.id} value={option.id} label={option.label} />
          ))}
        </RadioGroup>
      )

    case "multi":
      return (
        <CheckboxGroup
          value={Array.isArray(value) ? value : []}
          onValueChange={(next) => onAnswer(question.id, next)}
        >
          {question.options.map((option) => (
            <CheckboxOption key={option.id} value={option.id} label={option.label} />
          ))}
        </CheckboxGroup>
      )

    case "scale":
      return (
        <ScaleInput
          value={typeof value === "number" ? value : undefined}
          onValueChange={(next) => onAnswer(question.id, next)}
          min={question.min}
          max={question.max}
          minLabel={question.minLabel}
          maxLabel={question.maxLabel}
        />
      )

    case "ranking":
      return (
        <div role="group" aria-label={question.prompt} aria-describedby={describedBy}>
          <RankList
            value={Array.isArray(value) ? value : []}
            onValueChange={(next) => onAnswer(question.id, next)}
            items={question.items}
          />
        </div>
      )
  }
}

type Props = {
  screen: Screen
  answers: Answers
  onAnswer: (questionId: string, value: AnswerValue) => void
  showErrors: boolean
}

type ControlProps = {
  question: Question
  answers: Answers
  onAnswer: (questionId: string, value: AnswerValue) => void
  describedBy?: string
}
