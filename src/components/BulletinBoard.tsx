/**
 * Bulletin Board Component
 * Displays SYSOP-13 bulletins in a retro terminal style
 */

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { api } from "../services/api";
import type { Post } from "../types/post";

interface BulletinBoardProps {
  limit?: number;
  showLatestOnly?: boolean;
  compact?: boolean;
}

const BulletinContainer = styled.div<{ $compact?: boolean }>`
  background: rgba(0, 0, 0, 0.8);
  border: 2px solid ${(props) => props.theme.colors?.primary || "#00ff00"};
  padding: ${(props) => (props.$compact ? "0.5rem" : "1rem")};
  margin: ${(props) => (props.$compact ? "0.5rem 0" : "1rem 0")};
  font-family: "Courier New", monospace;
  color: ${(props) => props.theme.colors?.primary || "#00ff00"};
  box-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
`;

const BulletinHeader = styled.div`
  text-align: center;
  border-bottom: 1px solid
    ${(props) => props.theme.colors?.primary || "#00ff00"};
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const BulletinItem = styled.div<{ $pinned?: boolean }>`
  margin-bottom: 1rem;
  padding: 0.75rem;
  border-left: 3px solid
    ${(props) => (props.$pinned ? "#ffff00" : "transparent")};
  background: ${(props) =>
    props.$pinned ? "rgba(255, 255, 0, 0.05)" : "transparent"};

  &:last-child {
    margin-bottom: 0;
  }
`;

const BulletinMeta = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  opacity: 0.8;
  margin-bottom: 0.5rem;
`;

const BulletinType = styled.span<{ $type?: string }>`
  color: ${(props) => {
    switch (props.$type) {
      case "daily":
        return "#00ffff";
      case "announcement":
        return "#ffff00";
      case "lore":
        return "#ff00ff";
      case "system":
        return "#ff0000";
      default:
        return "#00ff00";
    }
  }};
  text-transform: uppercase;
  font-weight: bold;
`;

const BulletinTimestamp = styled.span`
  opacity: 0.6;
`;

const BulletinMessage = styled.div`
  line-height: 1.6;
  white-space: pre-wrap;
`;

const PinIndicator = styled.span`
  color: #ffff00;
  margin-right: 0.5rem;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 1rem;
  opacity: 0.6;
`;

const ErrorMessage = styled.div`
  color: #ff0000;
  text-align: center;
  padding: 1rem;
`;

const NoBulletinsMessage = styled.div`
  text-align: center;
  padding: 1rem;
  opacity: 0.6;
  font-style: italic;
`;

export const BulletinBoard: React.FC<BulletinBoardProps> = ({
  limit = 10,
  showLatestOnly = false,
  compact = false,
}) => {
  const [bulletins, setBulletins] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBulletins();
  }, [limit, showLatestOnly]);

  const loadBulletins = async () => {
    try {
      setLoading(true);
      setError(null);

      if (showLatestOnly) {
        const latest = await api.getLatestBulletin();
        setBulletins(latest ? [latest] : []);
      } else {
        const data = await api.getBulletins({
          limit,
          includeUnpinned: true,
        });
        setBulletins(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load bulletins");
      console.error("Error loading bulletins:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  if (loading) {
    return (
      <BulletinContainer $compact={compact}>
        <BulletinHeader>
          {showLatestOnly ? "[ Latest Bulletin ]" : "[ System Bulletins ]"}
        </BulletinHeader>
        <LoadingMessage>Loading bulletins...</LoadingMessage>
      </BulletinContainer>
    );
  }

  if (error) {
    return (
      <BulletinContainer $compact={compact}>
        <BulletinHeader>
          {showLatestOnly ? "[ Latest Bulletin ]" : "[ System Bulletins ]"}
        </BulletinHeader>
        <ErrorMessage>Error: {error}</ErrorMessage>
      </BulletinContainer>
    );
  }

  if (bulletins.length === 0) {
    return (
      <BulletinContainer $compact={compact}>
        <BulletinHeader>
          {showLatestOnly ? "[ Latest Bulletin ]" : "[ System Bulletins ]"}
        </BulletinHeader>
        <NoBulletinsMessage>No bulletins available</NoBulletinsMessage>
      </BulletinContainer>
    );
  }

  return (
    <BulletinContainer $compact={compact}>
      <BulletinHeader>
        {showLatestOnly
          ? "[ Latest Bulletin from SYSOP-13 ]"
          : "[ System Bulletins ]"}
      </BulletinHeader>
      {bulletins.map((bulletin) => (
        <BulletinItem key={bulletin.id} $pinned={!!bulletin.is_pinned}>
          <BulletinMeta>
            <div>
              {bulletin.is_pinned && <PinIndicator>[PINNED]</PinIndicator>}
              <BulletinType $type={bulletin.bulletin_type || undefined}>
                [{bulletin.bulletin_type || "bulletin"}]
              </BulletinType>{" "}
              <strong>{bulletin.user}</strong>
            </div>
            <BulletinTimestamp>
              {formatTimestamp(bulletin.timestamp)}
            </BulletinTimestamp>
          </BulletinMeta>
          <BulletinMessage>{bulletin.message}</BulletinMessage>
        </BulletinItem>
      ))}
    </BulletinContainer>
  );
};

export default BulletinBoard;
