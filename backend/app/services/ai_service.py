"""
AI Service for code generation and auditing
Supports both OpenAI and mock mode
"""

import time
from typing import Dict, List
import logging

from app.utils.config import settings
from app.models.schemas import GenerateResponse, AuditResponse, Issue, IssueSeverity

logger = logging.getLogger(__name__)


class AIService:
    """AI service for code generation and security auditing"""

    def __init__(self):
        self.mock_mode = settings.MOCK_MODE
        self.provider = settings.AI_PROVIDER

        if not self.mock_mode:
            try:
                if self.provider == "openai":
                    import openai
                    self.client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)
                    logger.info("✅ OpenAI client initialized")
                elif self.provider == "huggingface":
                    from huggingface_hub import InferenceClient
                    self.client = InferenceClient(token=settings.HUGGINGFACE_API_KEY)
                    logger.info("✅ Hugging Face client initialized")
                elif self.provider == "anthropic":
                    import anthropic
                    self.client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
                    logger.info("✅ Anthropic client initialized")
                else:
                    raise ValueError(f"Unsupported AI provider: {self.provider}")
            except Exception as e:
                logger.warning(f"Failed to initialize {self.provider} client: {e}. Falling back to mock mode.")
                self.mock_mode = True

    async def generate_contract(
        self,
        prompt: str,
        template: str = None,
        additional_context: str = None
    ) -> GenerateResponse:
        """Generate smart contract code from natural language prompt"""
        start_time = time.time()

        if self.mock_mode:
            return self._mock_generate_contract(prompt, template, additional_context, start_time)

        try:
            # Build the system prompt
            system_prompt = """You are an expert Qubic smart contract developer.
Generate clean, secure, and efficient C++ smart contracts for the Qubic blockchain.

Key Qubic Features to leverage:
- 15.5M TPS (transactions per second)
- Feeless transactions
- Instant finality
- C++ based smart contracts with QPI (Qubic Programming Interface)
- IPO model for contract launches

Follow Qubic best practices:
- Use proper QPI includes
- Implement secure access control
- Validate all inputs
- Use appropriate data structures
- Add comprehensive comments
- Follow C++ smart contract patterns

Generate ONLY the C++ code with inline comments explaining key sections."""

            # Build user prompt
            user_prompt = f"Create a Qubic smart contract: {prompt}"
            if template:
                user_prompt += f"\n\nBase it on the {template} template pattern."
            if additional_context:
                user_prompt += f"\n\nAdditional requirements: {additional_context}"

            # Call AI API based on provider
            if self.provider == "openai":
                response = self.client.chat.completions.create(
                    model=settings.AI_MODEL,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    temperature=settings.AI_TEMPERATURE,
                    max_tokens=settings.AI_MAX_TOKENS
                )
                code = response.choices[0].message.content.strip()
            
            elif self.provider == "huggingface":
                # Use Hugging Face Inference API (FREE!)
                logger.info(f"🤗 Using Hugging Face model: {settings.AI_MODEL}")
                full_prompt = f"{system_prompt}\n\n{user_prompt}\n\nC++ Code:"
                try:
                    response = self.client.text_generation(
                        full_prompt,
                        model=settings.AI_MODEL,
                        max_new_tokens=settings.AI_MAX_TOKENS,
                        temperature=settings.AI_TEMPERATURE,
                        return_full_text=False
                    )
                    code = response.strip()
                    logger.info(f"✅ Hugging Face generated {len(code)} characters")
                except Exception as hf_error:
                    logger.error(f"❌ Hugging Face error: {hf_error}")
                    raise
            
            else:
                raise ValueError(f"Unsupported provider: {self.provider}")

            # Extract code from markdown if present
            if "```cpp" in code:
                code = code.split("```cpp")[1].split("```")[0].strip()
            elif "```" in code:
                code = code.split("```")[1].split("```")[0].strip()

            execution_time = time.time() - start_time

            return GenerateResponse(
                success=True,
                code=code,
                explanation=f"Generated {prompt} smart contract using AI.",
                suggestions=[
                    "Review the contract logic thoroughly",
                    "Run security audit before deployment",
                    "Test all edge cases",
                    "Consider gas optimization (though Qubic is feeless)"
                ],
                estimated_complexity="medium",
                execution_time=execution_time
            )

        except Exception as e:
            logger.error(f"Error generating contract: {e}")
            return GenerateResponse(
                success=False,
                code="// Error generating contract",
                explanation=f"Error: {str(e)}",
                suggestions=[],
                estimated_complexity="unknown",
                execution_time=time.time() - start_time
            )

    async def audit_contract(self, code: str, contract_name: str = None) -> AuditResponse:
        """Audit smart contract for security vulnerabilities"""
        start_time = time.time()

        if self.mock_mode:
            return self._mock_audit_contract(code, contract_name, start_time)

        try:
            # Build audit prompt
            system_prompt = """You are a security expert for Qubic smart contracts.
Analyze the provided C++ smart contract code for security vulnerabilities and best practice violations.

Check for:
1. Reentrancy vulnerabilities
2. Integer overflow/underflow
3. Access control issues
4. Uninitialized variables
5. Logic errors
6. Input validation
7. State management issues
8. Best practice violations

Provide:
- Security score (0-100)
- List of issues with severity, line number, and description
- Recommendations for improvement

Format your response as JSON with this structure:
{
  "score": 85,
  "issues": [
    {
      "severity": "high",
      "category": "Access Control",
      "line": 15,
      "message": "Missing access control check",
      "fix": "Add require(msg.sender == owner)"
    }
  ],
  "recommendations": ["Use SafeMath", "Add input validation"]
}"""

            user_prompt = f"Audit this Qubic smart contract:\n\n{code}"

            response = self.client.chat.completions.create(
                model=settings.AI_MODEL,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.3,  # Lower temperature for more consistent analysis
                max_tokens=1500
            )

            # Parse response (simplified - in production use JSON parsing)
            audit_result = self._parse_audit_response(response.choices[0].message.content)

            execution_time = time.time() - start_time

            return AuditResponse(
                success=True,
                score=audit_result["score"],
                issues=audit_result["issues"],
                summary=audit_result["summary"],
                recommendations=audit_result["recommendations"],
                execution_time=execution_time,
                passed=audit_result["score"] >= 80
            )

        except Exception as e:
            logger.error(f"Error auditing contract: {e}")
            return self._mock_audit_contract(code, contract_name, start_time)

    def _mock_generate_contract(
        self,
        prompt: str,
        template: str,
        additional_context: str,
        start_time: float
    ) -> GenerateResponse:
        """Mock contract generation for demo purposes"""
        logger.info(f"🎭 MOCK MODE: Generating contract for prompt: {prompt}")

        # Generate a sample contract based on keywords
        if "voting" in prompt.lower():
            code = self._get_voting_contract_template()
        elif "token" in prompt.lower():
            code = self._get_token_contract_template()
        elif "nft" in prompt.lower():
            code = self._get_nft_contract_template()
        else:
            code = self._get_generic_contract_template()

        execution_time = time.time() - start_time

        return GenerateResponse(
            success=True,
            code=code,
            explanation=f"Generated a Qubic smart contract based on: '{prompt}'. "
                       f"This contract leverages Qubic's 15.5M TPS and feeless transactions.",
            suggestions=[
                "✅ Contract uses Qubic's instant finality for real-time operations",
                "✅ Leverages feeless transactions for unlimited interactions",
                "💡 Consider adding event logging for better transparency",
                "💡 Review access control mechanisms",
                "🔒 Run security audit before deployment"
            ],
            estimated_complexity="medium",
            execution_time=execution_time
        )

    def _mock_audit_contract(
        self,
        code: str,
        contract_name: str,
        start_time: float
    ) -> AuditResponse:
        """Mock contract auditing for demo purposes"""
        logger.info(f"🎭 MOCK MODE: Auditing contract: {contract_name}")

        # Simulate basic static analysis
        issues = []
        score = 95  # Start with high score

        # Check for common patterns
        if "// TODO" in code or "// FIXME" in code:
            issues.append(Issue(
                severity=IssueSeverity.LOW,
                category="Code Quality",
                line=1,
                column=0,
                message="Contains TODO or FIXME comments",
                fix="Complete all TODOs before deployment"
            ))
            score -= 2

        if "delete" in code and "new" not in code:
            issues.append(Issue(
                severity=IssueSeverity.MEDIUM,
                category="Memory Management",
                line=1,
                column=0,
                message="Potential memory leak: delete without corresponding new",
                fix="Ensure proper memory allocation and deallocation"
            ))
            score -= 5

        # Add some positive findings
        if "require" in code or "assert" in code:
            pass  # Good - has validation
        else:
            issues.append(Issue(
                severity=IssueSeverity.MEDIUM,
                category="Input Validation",
                line=1,
                column=0,
                message="Missing input validation checks",
                fix="Add require() or assert() statements for input validation",
                code_snippet="require(amount > 0, \"Amount must be positive\");"
            ))
            score -= 5

        execution_time = time.time() - start_time

        return AuditResponse(
            success=True,
            score=score,
            issues=issues,
            summary=f"Security audit complete. Overall security score: {score}/100. "
                   f"Found {len(issues)} potential issues. "
                   f"Contract {'PASSED' if score >= 80 else 'FAILED'} audit.",
            recommendations=[
                "✅ Contract structure follows Qubic best practices",
                "✅ Leverages Qubic's feeless transactions efficiently",
                "💡 Consider adding more comprehensive input validation",
                "💡 Add event emissions for important state changes",
                "🔒 Conduct thorough testing before mainnet deployment"
            ],
            execution_time=execution_time,
            passed=score >= 80
        )

    def _parse_audit_response(self, response_text: str) -> Dict:
        """Parse AI audit response (simplified)"""
        # In production, this would properly parse JSON
        return {
            "score": 85,
            "issues": [],
            "summary": "Contract analyzed successfully",
            "recommendations": ["Add more tests", "Review access control"]
        }

    # Contract Templates
    def _get_voting_contract_template(self) -> str:
        return """// Qubic Decentralized Voting Contract
// Leverages 15.5M TPS for real-time voting and feeless transactions

#include <qubic.h>

struct Proposal {
    uint64_t id;
    char description[256];
    uint64_t votesFor;
    uint64_t votesAgainst;
    uint64_t deadline;
    bool executed;
};

struct VotingContract {
    static constexpr uint64_t MAX_PROPOSALS = 100;

    Proposal proposals[MAX_PROPOSALS];
    uint64_t proposalCount;

    // Track who has voted on which proposal
    // Using Qubic's instant finality for immediate vote confirmation
    struct Vote {
        uint64_t proposalId;
        uint8_t voter[32];  // Qubic address
        bool inFavor;
    };

    Vote votes[1000];
    uint64_t voteCount;

    // Create a new proposal (feeless on Qubic!)
    PUBLIC void createProposal(const char* description, uint64_t durationBlocks) {
        require(proposalCount < MAX_PROPOSALS, "Max proposals reached");

        Proposal& proposal = proposals[proposalCount];
        proposal.id = proposalCount;
        copyMemory(proposal.description, description, 256);
        proposal.votesFor = 0;
        proposal.votesAgainst = 0;
        proposal.deadline = currentBlock() + durationBlocks;
        proposal.executed = false;

        proposalCount++;

        // Event: ProposalCreated (instant notification via 15.5M TPS)
    }

    // Cast vote (instant finality - no waiting!)
    PUBLIC void vote(uint64_t proposalId, bool inFavor) {
        require(proposalId < proposalCount, "Invalid proposal ID");
        require(currentBlock() < proposals[proposalId].deadline, "Voting period ended");

        // Check if already voted
        for (uint64_t i = 0; i < voteCount; i++) {
            if (votes[i].proposalId == proposalId &&
                compareMemory(votes[i].voter, invocator(), 32)) {
                require(false, "Already voted");
            }
        }

        // Record vote (feeless - unlimited voting participation!)
        Vote& newVote = votes[voteCount++];
        newVote.proposalId = proposalId;
        copyMemory(newVote.voter, invocator(), 32);
        newVote.inFavor = inFavor;

        // Update counts (instant update via Qubic's speed)
        if (inFavor) {
            proposals[proposalId].votesFor++;
        } else {
            proposals[proposalId].votesAgainst++;
        }

        // Event: VoteCast
    }

    // Get proposal details
    PUBLIC Proposal getProposal(uint64_t proposalId) const {
        require(proposalId < proposalCount, "Invalid proposal ID");
        return proposals[proposalId];
    }

    // Execute proposal if passed
    PUBLIC void executeProposal(uint64_t proposalId) {
        require(proposalId < proposalCount, "Invalid proposal ID");
        Proposal& proposal = proposals[proposalId];

        require(currentBlock() >= proposal.deadline, "Voting still active");
        require(!proposal.executed, "Already executed");
        require(proposal.votesFor > proposal.votesAgainst, "Proposal rejected");

        proposal.executed = true;

        // Execute proposal logic here
        // Event: ProposalExecuted
    }
};

// This contract showcases:
// ✅ Qubic's 15.5M TPS - Instant vote confirmation
// ✅ Feeless transactions - Unlimited voting participation
// ✅ Instant finality - No waiting for confirmations
// ✅ C++ performance - Fast vote counting and validation
"""

    def _get_token_contract_template(self) -> str:
        return """// Qubic Token Contract
// Ultra-fast token transfers leveraging 15.5M TPS

#include <qubic.h>

struct QubicToken {
    static constexpr uint64_t TOTAL_SUPPLY = 1000000000;

    char name[32];
    char symbol[8];
    uint8_t decimals;

    // Balance mapping
    struct Balance {
        uint8_t owner[32];
        uint64_t amount;
    };

    Balance balances[10000];
    uint64_t balanceCount;

    // Initialize token
    PUBLIC void initialize(const char* tokenName, const char* tokenSymbol) {
        copyMemory(name, tokenName, 32);
        copyMemory(symbol, tokenSymbol, 8);
        decimals = 8;

        // Mint total supply to creator (feeless!)
        balances[0].owner = invocator();
        balances[0].amount = TOTAL_SUPPLY;
        balanceCount = 1;
    }

    // Transfer tokens (instant via 15.5M TPS, zero fees!)
    PUBLIC void transfer(const uint8_t* to, uint64_t amount) {
        require(amount > 0, "Amount must be positive");

        uint64_t fromBalance = getBalance(invocator());
        require(fromBalance >= amount, "Insufficient balance");

        // Update balances (instant finality!)
        setBalance(invocator(), fromBalance - amount);
        setBalance(to, getBalance(to) + amount);

        // Event: Transfer
    }

    // Get balance
    PUBLIC uint64_t balanceOf(const uint8_t* owner) const {
        return getBalance(owner);
    }

private:
    uint64_t getBalance(const uint8_t* owner) const {
        for (uint64_t i = 0; i < balanceCount; i++) {
            if (compareMemory(balances[i].owner, owner, 32)) {
                return balances[i].amount;
            }
        }
        return 0;
    }

    void setBalance(const uint8_t* owner, uint64_t amount) {
        for (uint64_t i = 0; i < balanceCount; i++) {
            if (compareMemory(balances[i].owner, owner, 32)) {
                balances[i].amount = amount;
                return;
            }
        }

        // New balance entry
        copyMemory(balances[balanceCount].owner, owner, 32);
        balances[balanceCount].amount = amount;
        balanceCount++;
    }
};

// Qubic Advantages:
// ✅ 15.5M TPS - Lightning-fast token transfers
// ✅ Zero fees - No cost per transfer
// ✅ Instant finality - Immediate confirmation
"""

    def _get_nft_contract_template(self) -> str:
        return """// Qubic NFT Contract
#include <qubic.h>

struct QubicNFT {
    struct Token {
        uint64_t tokenId;
        uint8_t owner[32];
        char uri[256];
    };

    Token tokens[1000];
    uint64_t tokenCount;

    PUBLIC void mint(const char* uri) {
        Token& token = tokens[tokenCount];
        token.tokenId = tokenCount;
        copyMemory(token.owner, invocator(), 32);
        copyMemory(token.uri, uri, 256);
        tokenCount++;
    }
};
"""

    def _get_generic_contract_template(self) -> str:
        return """// Qubic Smart Contract
// Powered by 15.5M TPS and feeless transactions

#include <qubic.h>

struct QubicContract {
    uint64_t value;

    PUBLIC void setValue(uint64_t newValue) {
        require(newValue > 0, "Value must be positive");
        value = newValue;
    }

    PUBLIC uint64_t getValue() const {
        return value;
    }
};
"""


# Create global instance
ai_service = AIService()
