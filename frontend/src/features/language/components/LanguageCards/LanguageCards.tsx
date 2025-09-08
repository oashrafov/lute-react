import type { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { Group, Radio, rem, ScrollArea } from "@mantine/core";
import { LanguageCard } from "../LanguageCard/LanguageCard";
import { queries } from "../../api/queries";
import classes from "./LanguageCards.module.css";

interface LanguageCards {
  label: ReactNode;
  description: string;
}

export function LanguageCards({ label, description }: LanguageCards) {
  const { data: languages } = useQuery(queries.userLanguagesList());
  const [params, setParams] = useSearchParams();
  const currentId = params.get("langId");

  function handleLanguageChange(id: string) {
    if (id === params.get("langId")) {
      params.delete("langId");
    } else {
      params.set("langId", id);
    }

    params.delete("name");
    setParams(params);
  }

  return (
    <Radio.Group
      styles={{ description: { marginBottom: rem(5) } }}
      label={label}
      description={description}
      name="langs"
      value={currentId}
      onChange={(id) => handleLanguageChange(id)}>
      <ScrollArea type="scroll" offsetScrollbars="x">
        <Group gap={2} wrap="nowrap" align="stretch">
          {languages
            ?.toSorted((a, b) => b.id - a.id)
            .map((data) => (
              <Radio.Card
                key={data.id}
                value={String(data.id)}
                className={classes.card}>
                <Group wrap="nowrap" align="flex-start" gap={8}>
                  <Radio.Indicator size="xs" />
                  <LanguageCard data={data} />
                </Group>
              </Radio.Card>
            ))}
        </Group>
      </ScrollArea>
    </Radio.Group>
  );
}
